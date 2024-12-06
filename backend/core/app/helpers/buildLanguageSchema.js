import languages from '../../../../config/languages.json' with { type: "json" };;
import _ from 'lodash';

export default function (fieldName, schemaOptions) {
  const fields = {};
  _.each(languages, (language, languageKey) => {
    fields[`${languageKey}-${fieldName}`] = { ...schemaOptions, language: languageKey, isTranslatable: true };
  });
  return fields;
};