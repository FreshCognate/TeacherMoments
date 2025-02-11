import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async (props, options, context) => {

  let {
    searchValue = '',
    currentPage = 1,
    isDeleted = false,
  } = options;

  const { models } = context;

  const search = { isDeleted };
  const searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['name'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  const count = await models.Asset.countDocuments(search);

  const totalPages = getTotalPages(count);

  const assets = await models.Asset.find(search, null, searchOptions).sort('name');

  return {
    assets,
    count,
    currentPage,
    totalPages
  };

};