import each from 'lodash/each';
import Validators from "../forms.validators";
export default function testValidators(fieldKey, schema, model) {

  let hasError = false;
  let error = null;

  each(schema.validators, (validatorItem) => {
    // This makes sure we display the first error
    if (hasError) return;
    if (!Validators[validatorItem.type]) return console.warn(`Validator: ${validatorItem.type} has not been registered`);
    const testedValidator = Validators[validatorItem.type]({
      fieldKey,
      fieldValue: model[fieldKey],
      model,
      schema,
      validator: validatorItem,
    });
    hasError = testedValidator.hasError;
    error = testedValidator.error;
  });

  return {
    error,
    hasError
  };

}