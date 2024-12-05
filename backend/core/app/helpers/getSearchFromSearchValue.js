import each from 'lodash/each.js';

export default function (searchValue, fields, search) {

  if (!searchValue) return;

  search.$or = [];

  each(fields, function (field) {
    const searchField = {};
    searchField[field] = {
      $regex: searchValue,
      $options: 'i'
    };
    search.$or.push(searchField);
  });

};