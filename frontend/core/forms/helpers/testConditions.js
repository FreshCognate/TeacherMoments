import each from 'lodash/each';
import Conditions from "../forms.conditions";
export default function testConditions(fieldKey, schema, model) {

  let hasFieldCondition = false;
  let condition = null;
  let shouldHideField = false;

  each(schema.conditions, (conditionItem) => {
    // This makes sure we display the first condition
    if (hasCondition) return;
    if (!Conditions[conditionItem.type]) return console.warn(`Condition: ${conditionItem.type} has not been registered`);
    if (!model) return;
    const testedCondition = Conditions[conditionItem.type]({
      fieldKey,
      fieldValue: model[fieldKey],
      model,
      schema,
      condition: conditionItem,
    });
    if (testedCondition.hasCondition) {
      hasFieldCondition = true;
      condition = testedCondition.condition;
      if (conditionItem.shouldHideField) {
        shouldHideField = true;
      }
    }
  });

  return {
    hasCondition: hasFieldCondition,
    condition,
    shouldHideField,
  };

}