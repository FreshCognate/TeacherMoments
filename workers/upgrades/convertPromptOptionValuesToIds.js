import '../../backend/modules/blocks/index.js';
import '../../backend/modules/triggers/index.js';
import '../../backend/modules/runs/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import find from 'lodash/find.js';
import filter from 'lodash/filter.js';
import map from 'lodash/map.js';
import isEqual from 'lodash/isEqual.js';

// Historically, multiple choice selections were stored (in trigger conditions
// and run tracking) by the option's editable `value` string. Editing that value
// broke the reference. This upgrade rewrites those stored values to the option's
// stable `_id`, mapping each collection against its own block set:
//   Trigger            -> Block            (draft authoring conditions)
//   Published_Trigger  -> Published_Block  (runtime match)
//   Run                -> Published_Block  (tracking + analytics)
// It is idempotent: strings that already match an option `_id` are left alone.

const makeReport = () => ({ converted: 0, alreadyMigrated: 0, unmapped: 0, unmappedDetails: [] });

const getOptionsLookup = async (Model, scenarioId, cache) => {
  const cacheKey = `${Model.modelName}:${scenarioId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const blocks = await Model.find({ scenario: scenarioId }).lean();
  const lookup = new Map();
  for (const block of blocks) {
    lookup.set(String(block.ref), block.options || []);
  }

  cache.set(cacheKey, lookup);
  return lookup;
};

const convertStoredOptions = ({ storedOptions, options, report, context }) => {
  return map(storedOptions, (stored) => {
    const storedString = String(stored);

    const alreadyId = find(options, (option) => String(option._id) === storedString);
    if (alreadyId) {
      report.alreadyMigrated += 1;
      return storedString;
    }

    const valueMatches = filter(options, (option) => option.value === storedString);
    if (valueMatches.length === 1) {
      report.converted += 1;
      return String(valueMatches[0]._id);
    }

    report.unmapped += 1;
    report.unmappedDetails.push({ ...context, value: storedString, valueMatches: valueMatches.length });
    console.log(`  ⚠️  Unmapped "${storedString}" (${context.label}) — ${valueMatches.length} value matches, left as-is`);
    return storedString;
  });
};

const convertTriggers = async ({ TriggerModel, BlockModel, cache, report }) => {
  const triggers = await TriggerModel.find({});
  console.log(`Processing ${triggers.length} ${TriggerModel.modelName} documents`);

  for (const trigger of triggers) {
    const lookup = await getOptionsLookup(BlockModel, trigger.scenario, cache);
    let triggerChanged = false;

    for (const item of trigger.items) {
      for (const condition of item.conditions) {
        for (const prompt of condition.prompts) {
          if (!prompt.options || prompt.options.length === 0) continue;

          const options = lookup.get(String(prompt.ref));
          if (!options) {
            report.unmapped += prompt.options.length;
            console.log(`  ⚠️  ${TriggerModel.modelName} ${trigger._id}: block ref ${prompt.ref} not found, left as-is`);
            continue;
          }

          const newOptions = convertStoredOptions({
            storedOptions: prompt.options,
            options,
            report,
            context: { label: `${TriggerModel.modelName} ${trigger._id} block ${prompt.ref}` }
          });

          if (!isEqual([...prompt.options], newOptions)) {
            prompt.options = newOptions;
            triggerChanged = true;
          }
        }
      }
    }

    if (triggerChanged) {
      trigger.markModified('items');
      await trigger.save();
    }
  }
};

const convertRuns = async ({ RunModel, PublishedBlockModel, cache, report }) => {
  const runs = await RunModel.find({});
  console.log(`Processing ${runs.length} Run documents`);

  for (const run of runs) {
    const lookup = await getOptionsLookup(PublishedBlockModel, run.scenario, cache);
    let runChanged = false;

    for (const stage of run.stages) {
      if (!stage.blocksByRef) continue;

      for (const [blockRef, blockData] of stage.blocksByRef.entries()) {
        if (!blockData.selectedOptions || blockData.selectedOptions.length === 0) continue;

        const options = lookup.get(String(blockRef));
        if (!options) {
          report.unmapped += blockData.selectedOptions.length;
          console.log(`  ⚠️  Run ${run._id}: published block ref ${blockRef} not found, left as-is`);
          continue;
        }

        const newSelectedOptions = convertStoredOptions({
          storedOptions: blockData.selectedOptions,
          options,
          report,
          context: { label: `Run ${run._id} block ${blockRef}` }
        });

        if (!isEqual([...blockData.selectedOptions], newSelectedOptions)) {
          blockData.selectedOptions = newSelectedOptions;
          stage.blocksByRef.set(String(blockRef), blockData);
          runChanged = true;
        }
      }
    }

    if (runChanged) {
      run.markModified('stages');
      await run.save();
    }
  }
};

const logReport = (label, report) => {
  console.log(`${label}: converted ${report.converted}, already migrated ${report.alreadyMigrated}, unmapped ${report.unmapped}`);
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;
  const cache = new Map();

  const triggerReport = makeReport();
  await convertTriggers({
    TriggerModel: models.Trigger,
    BlockModel: models.Block,
    cache,
    report: triggerReport
  });

  const publishedTriggerReport = makeReport();
  await convertTriggers({
    TriggerModel: models.Published_Trigger,
    BlockModel: models.Published_Block,
    cache,
    report: publishedTriggerReport
  });

  const runReport = makeReport();
  await convertRuns({
    RunModel: models.Run,
    PublishedBlockModel: models.Published_Block,
    cache,
    report: runReport
  });

  console.log('---');
  logReport('Triggers', triggerReport);
  logReport('Published triggers', publishedTriggerReport);
  logReport('Runs', runReport);
  console.log('Upgrade complete');

});
