import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async (props, options, context) => {

  const {
    scenario = null,
  } = props;

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

  if (scenario) {
    search.scenario = scenario;
  }

  const count = await models.Slide.countDocuments(search);

  const totalPages = getTotalPages(count);

  const slides = await models.Slide.find(search, null, searchOptions).sort('name');

  return {
    slides,
    count,
    currentPage,
    totalPages
  };

};