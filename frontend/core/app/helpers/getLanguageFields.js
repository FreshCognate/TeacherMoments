import languages from '../../../../config/languages.json';
import each from 'lodash/each';

export default ({ model, fields }) => {
  let returnedFields = {};
  each(languages, (language, languageKey) => {
    each(fields, (fieldValue, fieldKey) => {
      let searchKey = `${languageKey}-${fieldKey}`;
      let outputKey = `${languageKey}-${fieldValue}`;
      if (model[searchKey]) {
        returnedFields[outputKey] = model[searchKey];
      }
    })
  })

  return returnedFields;
}