import languages from '../../../../config/languages.json' with { type: "json" };
import each from 'lodash/each.js';
import isArray from 'lodash/isArray.js';

export default function (languagePopulates, populate = '') {

  if (isArray(languagePopulates)) {
    each(languagePopulates, (languagePopulate) => {
      each(languages, (language, languageKey) => {
        populate += `${languageKey}-${languagePopulate} `;
      });
    });
  } else {
    each(languages, (language, languageKey) => {
      each(languagePopulates.populate, (populateItem) => {
        populate += `${languageKey}-${populateItem} `;
      });
    });
    const populateObject = {
      path: languagePopulates.path,
      populate
    };
    return populateObject;
  }

  return populate;

};