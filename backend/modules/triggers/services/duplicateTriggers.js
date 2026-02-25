import omit from 'lodash/omit.js';
import map from 'lodash/map.js';

export default async ({ scenarioId, newScenarioId, slideRefMap, blockRefMap }, context) => {

  const { models, session } = context;

  const triggers = await models.Trigger.find({ scenario: scenarioId, isDeleted: false });

  for (const trigger of triggers) {
    const duplicatedTriggerObject = omit(trigger, ['_id', 'ref']);
    duplicatedTriggerObject.scenario = newScenarioId;
    duplicatedTriggerObject.elementRef = slideRefMap.get(trigger.elementRef.toString()) || trigger.elementRef;
    duplicatedTriggerObject.createdAt = new Date();

    duplicatedTriggerObject.items = map(trigger.items, (item) => {
      const duplicatedItem = item.toObject ? item.toObject() : { ...item };
      delete duplicatedItem._id;
      duplicatedItem.conditions = map(duplicatedItem.conditions, (condition) => {
        delete condition._id;
        condition.prompts = map(condition.prompts, (prompt) => {
          delete prompt._id;
          if (prompt.ref) {
            prompt.ref = blockRefMap.get(prompt.ref.toString()) || prompt.ref;
          }
          return prompt;
        });
        return condition;
      });
      return duplicatedItem;
    });

    await models.Trigger.create([duplicatedTriggerObject], { session });
  }

};
