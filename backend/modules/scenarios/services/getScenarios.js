import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async ({
  searchValue = '',
  currentPage = 1,
  accessType = null,
  isDeleted = false,
}, context) => {

  const { models } = context;

  const search = { isDeleted };
  const options = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['name'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, options);
  }

  if (accessType) {
    search.accessType = accessType;
  }

  const count = await models.Scenario.countDocuments(search);

  const totalPages = getTotalPages(count);

  const scenarios = await models.Scenario.find(search, null, options).sort('name');

  return {
    scenarios,
    count,
    currentPage,
    totalPages
  };

};