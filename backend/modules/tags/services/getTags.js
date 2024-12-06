import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async ({
  searchValue = '',
  currentPage = 1,
  tagType = null,
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

  if (tagType) {
    search.tagType = tagType;
  }

  const count = await models.Tag.countDocuments(search);

  const totalPages = getTotalPages(count);

  const tags = await models.Tag.find(search, null, options).sort('name');

  return {
    tags,
    count,
    currentPage,
    totalPages
  };

};