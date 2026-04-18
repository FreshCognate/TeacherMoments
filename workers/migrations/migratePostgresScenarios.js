import pg from 'pg';
import '../../backend/core/users/index.js';
import '../../backend/modules/scenarios/index.js';
import '../../backend/modules/slides/index.js';
import '../../backend/modules/stems/index.js';
import '../../backend/modules/blocks/index.js';
import '../../backend/modules/assets/index.js';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import mapComponent from './helpers/mapComponent.js';
import buildSlateFromText from './helpers/buildSlateFromText.js';
import buildSummaryFromComponents from './helpers/buildSummaryFromComponents.js';
import downloadAndUploadImage from './helpers/downloadAndUploadImage.js';
import resolveAuthors from './helpers/resolveAuthors.js';
import resolveConsent from './helpers/resolveConsent.js';
import isSlateEmpty from './helpers/isSlateEmpty.js';

function log(dryRun, ...args) {
  const prefix = dryRun ? '[DRY RUN]' : '[Migration]';
  console.log(prefix, ...args);
}

export default async (data) => {

  const { postgresUrl, scenarioIds, dryRun, createdBy } = data;

  log(dryRun, '=== STARTING MIGRATION ===');
  log(dryRun, `Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  log(dryRun, `Scenario filter: ${scenarioIds ? scenarioIds.join(', ') : 'ALL'}`);

  const pool = new pg.Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false }
  });

  let models;
  if (!dryRun) {
    const db = await connectDatabase();
    models = db.models;
  }

  const summary = {
    totalScenarios: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    totalSlides: 0,
    totalBlocks: 0,
    totalImages: 0,
    componentsByType: {},
    unresolvedRecallIds: [],
    unresolvedSlideRefs: [],
    failures: []
  };

  try {

    let scenarioQuery = `
      SELECT id, author_id, title, description, is_example, status, created_at, updated_at
      FROM scenario
      WHERE deleted_at IS NULL
    `;
    const queryParams = [];

    if (scenarioIds && scenarioIds.length > 0) {
      scenarioQuery += ' AND id = ANY($1)';
      queryParams.push(scenarioIds);
    }

    scenarioQuery += ' ORDER BY id';

    const scenarioResult = await pool.query(scenarioQuery, queryParams);
    const scenarios = scenarioResult.rows;

    summary.totalScenarios = scenarios.length;
    log(dryRun, `Found ${scenarios.length} scenarios to migrate`);

    for (let i = 0; i < scenarios.length; i++) {
      const pgScenario = scenarios[i];

      let scenario;
      const createdAssetIds = [];

      try {
        log(dryRun, '');
        log(dryRun, `Scenario ${i + 1}/${scenarios.length}: "${pgScenario.title}" (PG ID: ${pgScenario.id})`);
        log(dryRun, `  Description: ${pgScenario.description ? pgScenario.description.substring(0, 80) + '...' : '(none)'}`);
        log(dryRun, `  Is example: ${pgScenario.is_example}, Status: ${pgScenario.status}, Created: ${pgScenario.created_at}`);

        // Check if already migrated
        if (!dryRun) {
          const existing = await models.Scenario.findOne({ migrationId: pgScenario.id });
          if (existing) {
            log(dryRun, `  SKIPPED: Already migrated (MongoDB ID: ${existing._id})`);
            summary.skipped++;
            continue;
          }
        }

        // Fetch slides from PG
        const slideResult = await pool.query(`
          SELECT id, title, "order", is_finish, has_chat_enabled, components
          FROM slide
          WHERE scenario_id = $1
          ORDER BY "order" ASC
        `, [pgScenario.id]);

        const allPgSlides = slideResult.rows;
        const finishSlide = allPgSlides.find(s => s.is_finish);
        const pgSlides = allPgSlides.filter(s => !s.is_finish);
        summary.totalSlides += pgSlides.length;
        log(dryRun, `  Found ${pgSlides.length} slides${finishSlide ? ` (+ 1 finish slide merged into summary)` : ''}`);

        // Build summary from the is_finish slide (if any)
        const summarySlate = finishSlide
          ? buildSummaryFromComponents(finishSlide.components || [])
          : undefined;

        if (finishSlide) {
          log(dryRun, `  Finish slide PG ID ${finishSlide.id} → scenario summary (${(finishSlide.components || []).length} components merged)`);
        }

        // Resolve authors (original author + collaborators from PG)
        let resolvedCreatedBy = createdBy;
        let collaborators = [{ user: createdBy, role: 'OWNER' }];

        if (!dryRun) {
          const resolved = await resolveAuthors({
            pgScenario,
            pool,
            models,
            fallbackUserId: createdBy,
          });
          resolvedCreatedBy = resolved.createdBy;
          collaborators = resolved.collaborators;
          log(dryRun, `  Authors: ${resolved.matchedCount}/${resolved.pgEmailCount} PG users matched in MongoDB${resolved.unmatchedCount > 0 ? `, ${resolved.unmatchedCount} not found` : ''}`);
          if (resolved.originalAuthorEmail) {
            log(dryRun, `  Original author email: ${resolved.originalAuthorEmail} (createdBy: ${resolvedCreatedBy})`);
          }
        }

        // Resolve consent (custom consent text per scenario, if any)
        const resolvedConsent = await resolveConsent({ pgScenarioId: pgScenario.id, pool });
        if (resolvedConsent) {
          log(dryRun, `  Consent: custom (PG consent_id: ${resolvedConsent.consentId})`);
        } else {
          log(dryRun, `  Consent: using default (no scenario_consent row)`);
        }

        // Create scenario
        if (!dryRun) {
          const scenarioDoc = {
            name: pgScenario.title || 'Untitled Scenario',
            'en-US-title': pgScenario.title || '',
            'en-US-description': buildSlateFromText(pgScenario.description),
            accessType: 'PRIVATE',
            isExample: pgScenario.is_example || false,
            isPublished: false,
            isMigrated: true,
            migrationId: pgScenario.id,
            collaborators,
            createdAt: pgScenario.created_at,
            updatedAt: pgScenario.updated_at,
            createdBy: resolvedCreatedBy,
          };
          if (summarySlate) {
            scenarioDoc['en-US-summary'] = summarySlate;
          }
          if (resolvedConsent) {
            scenarioDoc['en-US-consent'] = resolvedConsent.slate;
          }
          scenario = await models.Scenario.create(scenarioDoc);
          log(dryRun, `  Created scenario (MongoDB ID: ${scenario._id})`);
        }

        // Create root stem
        let stem;
        if (!dryRun) {
          stem = await models.Stem.create({
            scenario: scenario._id,
            name: 'Stem 1',
            isRoot: true,
            createdBy: resolvedCreatedBy,
          });
          log(dryRun, `  Created root stem (ref: ${stem.ref})`);
        }

        // Create slides and track PG ID → MongoDB ref mapping
        const slideIdMap = new Map();

        for (let j = 0; j < pgSlides.length; j++) {
          const pgSlide = pgSlides[j];
          const slideType = pgSlide.is_finish ? 'SUMMARY' : 'STEP';

          log(dryRun, `  Slide ${j + 1}/${pgSlides.length}: "${pgSlide.title || '(untitled)'}" (PG ID: ${pgSlide.id}, order: ${pgSlide.order}, type: ${slideType}, chat: ${pgSlide.has_chat_enabled})`);

          if (!dryRun) {
            const slide = await models.Slide.create({
              scenario: scenario._id,
              name: pgSlide.title || '',
              slideType,
              sortOrder: j,
              stemRef: stem.ref,
              hasDiscussion: pgSlide.has_chat_enabled || false,
              createdAt: pgScenario.created_at,
              createdBy: resolvedCreatedBy,
            });
            slideIdMap.set(pgSlide.id, slide.ref);
            log(dryRun, `    Created slide (ref: ${slide.ref})`);
          }
        }

        // Create blocks and track responseId → MongoDB ref mapping
        const responseIdMap = new Map();
        const pendingRecalls = [];
        const pendingSlideActions = [];

        for (let j = 0; j < pgSlides.length; j++) {
          const pgSlide = pgSlides[j];
          const components = pgSlide.components || [];
          const slideRef = !dryRun ? slideIdMap.get(pgSlide.id) : null;

          let runningSortOrder = 0;

          for (let k = 0; k < components.length; k++) {
            const component = components[k];
            const componentType = component.type || 'Unknown';
            const mapped = mapComponent(component, runningSortOrder);

            summary.totalBlocks++;
            summary.componentsByType[componentType] = (summary.componentsByType[componentType] || 0) + 1;

            let details = `${componentType} → ${mapped.blockType}`;

            if (mapped.images.length > 0) {
              summary.totalImages += mapped.images.length;
              details += ` (${mapped.images.length} image${mapped.images.length > 1 ? 's' : ''})`;
            }

            if (mapped.responseId) {
              details += ` (responseId: "${mapped.responseId}")`;
            }

            if (mapped.recallId) {
              details += ` (recallId: "${mapped.recallId}")`;
            }

            if (mapped.pendingRecallId) {
              details += ` (pendingRecallId: "${mapped.pendingRecallId}")`;
            }

            if (mapped.pendingSlideRefs) {
              details += ` (paths to slides: ${mapped.pendingSlideRefs.join(', ')})`;
            }

            // Skip empty TEXT blocks (no title, no body) but still process images
            const hasEmptyBody = isSlateEmpty(mapped.fields?.['en-US-body']);
            const hasEmptyTitle = isSlateEmpty(mapped.fields?.['en-US-title']);
            const skipBlock = mapped.blockType === 'TEXT' && hasEmptyBody && hasEmptyTitle;

            if (skipBlock) {
              details += ' (SKIPPED: empty title and body)';
            }

            log(dryRun, `    Block ${k + 1}/${components.length}: ${details}`);

            // Create main block (unless skipping)
            let block;
            if (!dryRun && !skipBlock) {
              block = await models.Block.create({
                scenario: scenario._id,
                slideRef,
                blockType: mapped.blockType,
                sortOrder: runningSortOrder,
                createdAt: pgScenario.created_at,
                createdBy: resolvedCreatedBy,
                ...mapped.fields,
              });
              log(dryRun, `      Created block (ref: ${block.ref})`);
            }
            if (!skipBlock) runningSortOrder++;

            // Track refs for second-pass resolution
            if (mapped.responseId) {
              const ref = block ? block.ref : `placeholder-${summary.totalBlocks}`;
              responseIdMap.set(mapped.responseId, ref);
            }

            if (mapped.pendingRecallId) {
              pendingRecalls.push({ blockId: block?._id, recallId: mapped.pendingRecallId });
            }

            if (mapped.pendingSlideRefs) {
              pendingSlideActions.push({ blockId: block?._id, slideIds: mapped.pendingSlideRefs });
            }

            // Handle images: download + create IMAGES block
            for (const imageUrl of mapped.images) {
              if (!dryRun) {
                log(dryRun, `      Downloading image: ${imageUrl}`);
                try {
                  const asset = await downloadAndUploadImage({ url: imageUrl, models, createdBy: resolvedCreatedBy });
                  createdAssetIds.push(asset._id);
                  log(dryRun, `      Uploaded image as Asset (id: ${asset._id})`);

                  const imagesBlock = await models.Block.create({
                    scenario: scenario._id,
                    slideRef,
                    blockType: 'IMAGES',
                    sortOrder: runningSortOrder,
                    items: [{ 'en-US-asset': asset._id, 'en-US-caption': '' }],
                    createdAt: pgScenario.created_at,
                    createdBy: resolvedCreatedBy,
                  });
                  log(dryRun, `      Created IMAGES block (ref: ${imagesBlock.ref})`);
                } catch (imageError) {
                  log(dryRun, `      WARNING: Image download failed (${imageUrl}): ${imageError.message}`);
                }
              } else {
                log(dryRun, `      Image: ${imageUrl} (would download and create IMAGES block)`);
              }
              runningSortOrder++;
            }
          }
        }

        // Second pass: resolve references
        log(dryRun, `  Resolving references for scenario "${pgScenario.title}"...`);

        for (const pending of pendingRecalls) {
          const resolvedRef = responseIdMap.get(pending.recallId);
          if (resolvedRef) {
            log(dryRun, `    RESPONSE block → resolved (recallId: "${pending.recallId}")`);
            if (!dryRun) {
              await models.Block.updateOne({ _id: pending.blockId }, { responseRef: resolvedRef });
            }
          } else {
            summary.unresolvedRecallIds.push(pending.recallId);
            log(dryRun, `    RESPONSE block → WARNING: recallId "${pending.recallId}" not found`);
          }
        }

        for (const pending of pendingSlideActions) {
          if (!dryRun) {
            const block = await models.Block.findById(pending.blockId);
            let updated = false;
            for (let a = 0; a < block.actions.length; a++) {
              const pgSlideId = parseInt(block.actions[a].actionValue, 10);
              const newSlideRef = slideIdMap.get(pgSlideId);
              if (newSlideRef) {
                block.actions[a].actionValue = newSlideRef.toString();
                updated = true;
                log(dryRun, `    ACTIONS_PROMPT → slide ref resolved (PG slide ${pgSlideId} → ${newSlideRef})`);
              } else {
                summary.unresolvedSlideRefs.push(pgSlideId);
                log(dryRun, `    ACTIONS_PROMPT → WARNING: PG slide ${pgSlideId} not found`);
              }
            }
            if (updated) await block.save();
          } else {
            for (const slideId of pending.slideIds) {
              const slideExists = pgSlides.some(s => s.id === slideId);
              if (slideExists) {
                log(dryRun, `    ACTIONS_PROMPT → slide ref resolved (PG slide ${slideId})`);
              } else {
                summary.unresolvedSlideRefs.push(slideId);
                log(dryRun, `    ACTIONS_PROMPT → WARNING: PG slide ${slideId} not found in this scenario`);
              }
            }
          }
        }

        summary.succeeded++;

      } catch (error) {
        summary.failed++;
        summary.failures.push({ pgId: pgScenario.id, title: pgScenario.title, error: error.message });
        log(dryRun, `  ERROR migrating scenario "${pgScenario.title}" (PG ID: ${pgScenario.id}): ${error.message}`);
        console.log(error);

        if (!dryRun && scenario) {
          log(dryRun, `  Cleaning up partial scenario...`);
          try {
            const blockResult = await models.Block.deleteMany({ scenario: scenario._id });
            const slideResult = await models.Slide.deleteMany({ scenario: scenario._id });
            const stemResult = await models.Stem.deleteMany({ scenario: scenario._id });
            const assetResult = createdAssetIds.length > 0
              ? await models.Asset.deleteMany({ _id: { $in: createdAssetIds } })
              : { deletedCount: 0 };
            await models.Scenario.deleteOne({ _id: scenario._id });
            log(dryRun, `  Cleanup complete: deleted ${blockResult.deletedCount} blocks, ${slideResult.deletedCount} slides, ${stemResult.deletedCount} stems, ${assetResult.deletedCount} assets, 1 scenario`);
          } catch (cleanupError) {
            log(dryRun, `  WARNING: Cleanup failed for scenario ${scenario._id}: ${cleanupError.message}`);
          }
        }
      }
    }

  } finally {
    await pool.end();
  }

  log(dryRun, '');
  log(dryRun, '=== COMPLETE ===');
  log(dryRun, `Total scenarios: ${summary.totalScenarios} | Succeeded: ${summary.succeeded} | Failed: ${summary.failed} | Skipped: ${summary.skipped}`);
  log(dryRun, `Total slides: ${summary.totalSlides}`);
  log(dryRun, `Total blocks: ${summary.totalBlocks}`);
  log(dryRun, `Total images found: ${summary.totalImages}`);
  log(dryRun, `Components by type:`, summary.componentsByType);

  if (summary.unresolvedRecallIds.length > 0) {
    log(dryRun, `Unresolved recallIds:`, summary.unresolvedRecallIds);
  }

  if (summary.unresolvedSlideRefs.length > 0) {
    log(dryRun, `Unresolved slide refs:`, summary.unresolvedSlideRefs);
  }

  if (summary.failures.length > 0) {
    log(dryRun, `Failed scenarios:`, summary.failures);
  }

};
