import '../../backend/modules/triggers/index.js';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import filter from 'lodash/filter.js';

// Triggers used to be created with a schema default of `items: [{}]`. For
// SHOW_FEEDBACK_FROM_PROMPTS that blank item is a real starter row the author
// fills in, but BRANCH_TO_STEM_FROM_PROMPTS items are keyed by the stem they
// point at, so an item with no `elementRef` is a rule with no destination. It
// never renders (the editor maps over stems and looks the item up), so it can't
// be removed by hand, and the runtime no-match fallback can select it and then
// fail to resolve a stem. This upgrade drops those items.
//
// Items with no `elementRef` but with conditions are left alone and reported —
// they shouldn't exist, and deleting authored conditions is not recoverable.

const makeReport = () => ({ triggersUpdated: 0, itemsRemoved: 0, skipped: 0 });

const removeEmptyItems = async ({ TriggerModel, report }) => {
  const triggers = await TriggerModel.find({ action: 'BRANCH_TO_STEM_FROM_PROMPTS' }).lean();
  console.log(`Processing ${triggers.length} ${TriggerModel.modelName} documents`);

  for (const trigger of triggers) {
    const keptItems = filter(trigger.items, (item) => {
      if (item.elementRef) return true;

      if (item.conditions?.length) {
        report.skipped += 1;
        console.log(`  ⚠️  ${TriggerModel.modelName} ${trigger._id}: item ${item._id} has no elementRef but has ${item.conditions.length} condition(s), left as-is`);
        return true;
      }

      return false;
    });

    const removedCount = trigger.items.length - keptItems.length;
    if (!removedCount) continue;

    await TriggerModel.updateOne({ _id: trigger._id }, { $set: { items: keptItems } });

    report.triggersUpdated += 1;
    report.itemsRemoved += removedCount;
    console.log(`  ${TriggerModel.modelName} ${trigger._id}: removed ${removedCount} empty item(s)`);
  }
};

const logReport = (label, report) => {
  console.log(`${label}: updated ${report.triggersUpdated} triggers, removed ${report.itemsRemoved} items, skipped ${report.skipped}`);
};

export default async () => withConnection(async (connection) => {

  const { models } = connection;

  const triggerReport = makeReport();
  await removeEmptyItems({ TriggerModel: models.Trigger, report: triggerReport });

  const publishedTriggerReport = makeReport();
  await removeEmptyItems({ TriggerModel: models.Published_Trigger, report: publishedTriggerReport });

  console.log('---');
  logReport('Triggers', triggerReport);
  logReport('Published triggers', publishedTriggerReport);
  console.log('Upgrade complete');

});
