import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';

export default async (props, options, context) => {

  const {
    accessType = null
  } = props;

  let {
    searchValue = '',
    currentPage = 1,
    sortBy = 'NAME',
    isDeleted = false,
  } = options;

  const { models, user } = context;

  let search = { isDeleted };
  let searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['name'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  if (accessType) {
    search.accessType = accessType;
  }

  let sort = 'name';

  if (sortBy === 'NEWEST') {
    sort = '-createdAt';
  } else if (sortBy === 'OLDEST') {
    sort = 'createdAt';
  }

  search.collaborators = {
    $elemMatch: {
      user: user._id,
      role: { $in: ['OWNER', 'AUTHOR'] }
    }
  }

  const count = await models.Scenario.countDocuments(search);

  const totalPages = getTotalPages(count);

  const scenarios = await models.Scenario.find(search, null, searchOptions).sort(sort);

  return {
    scenarios,
    count,
    currentPage,
    totalPages
  };

};