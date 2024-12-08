import languages from '../../../../config/languages.json' with { type: "json" };;
import _ from 'lodash';

export default function (fieldName, validation) {
  const validations = {};
  _.each(languages, (language, languageKey) => {
    validations[`${languageKey}-${fieldName}`] = validation;
  });
  return validations;
};