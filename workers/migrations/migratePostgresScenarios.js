import pg from 'pg';
//import mapComponent from './helpers/mapComponent.js';

function log(dryRun, ...args) {
  const prefix = dryRun ? '[DRY RUN]' : '[Migration]';
  console.log(prefix, ...args);
}

export default async (data) => {

  const { postgresUrl, scenarioIds, dryRun } = data;

  log(dryRun, '=== STARTING MIGRATION ===');
  log(dryRun, `Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  log(dryRun, `Scenario filter: ${scenarioIds ? scenarioIds.join(', ') : 'ALL'}`);

  const pool = new pg.Pool({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false }
  });

  const summary = {
    totalScenarios: 0,
    succeeded: 0,
    failed: 0,
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
      SELECT id, title, description, is_example, status, created_at, updated_at
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
      const scenario = scenarios[i];

      try {
        log(dryRun, '');
        log(dryRun, `Scenario ${i + 1}/${scenarios.length}: "${scenario.title}" (PG ID: ${scenario.id})`);
        log(dryRun, `  Description: ${scenario.description ? scenario.description.substring(0, 80) + '...' : '(none)'}`);
        log(dryRun, `  Is example: ${scenario.is_example}, Status: ${scenario.status}, Created: ${scenario.created_at}`);

        const slideResult = await pool.query(`
          SELECT id, title, "order", is_finish, has_chat_enabled, components
          FROM slide
          WHERE scenario_id = $1
          ORDER BY "order" ASC
        `, [scenario.id]);

        const slides = slideResult.rows;
        summary.totalSlides += slides.length;
        log(dryRun, `  Found ${slides.length} slides`);

        const responseIdMap = new Map();
        const pendingRecalls = [];
        const pendingSlideActions = [];

        for (let j = 0; j < slides.length; j++) {
          const slide = slides[j];
          const components = slide.components || [];
          const slideType = slide.is_finish ? 'SUMMARY' : 'STEP';

          log(dryRun, `  Slide ${j + 1}/${slides.length}: "${slide.title || '(untitled)'}" (PG ID: ${slide.id}, order: ${slide.order}, type: ${slideType}, chat: ${slide.has_chat_enabled})`);

          for (let k = 0; k < components.length; k++) {
            const component = components[k];
            const componentType = component.type || 'Unknown';
            const mapped = mapComponent(component, k);

            summary.totalBlocks++;
            summary.componentsByType[componentType] = (summary.componentsByType[componentType] || 0) + 1;

            let details = `${componentType} → ${mapped.blockType}`;

            if (mapped.images.length > 0) {
              summary.totalImages += mapped.images.length;
              details += ` (${mapped.images.length} image${mapped.images.length > 1 ? 's' : ''})`;
            }

            if (mapped.responseId) {
              responseIdMap.set(mapped.responseId, `block-placeholder-${summary.totalBlocks}`);
              details += ` (responseId: "${mapped.responseId}")`;
            }

            if (mapped.recallId) {
              details += ` (recallId: "${mapped.recallId}")`;
            }

            if (mapped.pendingRecallId) {
              pendingRecalls.push({ recallId: mapped.pendingRecallId });
              details += ` (pendingRecallId: "${mapped.pendingRecallId}")`;
            }

            if (mapped.pendingSlideRefs) {
              pendingSlideActions.push({ slideIds: mapped.pendingSlideRefs });
              details += ` (paths to slides: ${mapped.pendingSlideRefs.join(', ')})`;
            }

            log(dryRun, `    Block ${k + 1}/${components.length}: ${details}`);

            if (mapped.images.length > 0) {
              for (const imageUrl of mapped.images) {
                log(dryRun, `      Image: ${imageUrl}`);
              }
            }
          }
        }

        log(dryRun, `  Resolving references for scenario "${scenario.title}"...`);

        for (const pending of pendingRecalls) {
          if (responseIdMap.has(pending.recallId)) {
            log(dryRun, `    RESPONSE block → resolved (recallId: "${pending.recallId}")`);
          } else {
            summary.unresolvedRecallIds.push(pending.recallId);
            log(dryRun, `    RESPONSE block → WARNING: recallId "${pending.recallId}" not found`);
          }
        }

        for (const pending of pendingSlideActions) {
          for (const slideId of pending.slideIds) {
            const slideExists = slides.some(s => s.id === slideId);
            if (slideExists) {
              log(dryRun, `    ACTIONS_PROMPT → slide ref resolved (PG slide ${slideId})`);
            } else {
              summary.unresolvedSlideRefs.push(slideId);
              log(dryRun, `    ACTIONS_PROMPT → WARNING: PG slide ${slideId} not found in this scenario`);
            }
          }
        }

        summary.succeeded++;

      } catch (error) {
        summary.failed++;
        summary.failures.push({ pgId: scenario.id, title: scenario.title, error: error.message });
        log(dryRun, `  ERROR migrating scenario "${scenario.title}" (PG ID: ${scenario.id}): ${error.message}`);
      }
    }

  } finally {
    await pool.end();
  }

  log(dryRun, '');
  log(dryRun, '=== COMPLETE ===');
  log(dryRun, `Total scenarios: ${summary.totalScenarios} | Succeeded: ${summary.succeeded} | Failed: ${summary.failed}`);
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
