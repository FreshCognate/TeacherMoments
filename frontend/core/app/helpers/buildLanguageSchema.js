import languages from '../../../../config/languages.json';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';

export default (fieldName, schemaOptions) => {
  const fields = {};

  each(languages, (language, languageKey) => {
    const options = cloneDeep(schemaOptions);
    const conditions = options.conditions || [];

    conditions.push({
      type: 'ls',
      language: languageKey,
      shouldHideField: true,
    });

    options.conditions = conditions;
    fields[`${languageKey}-${fieldName}`] = options;
  });
  return fields;
};