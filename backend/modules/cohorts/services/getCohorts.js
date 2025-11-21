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
    isArchived = false,
    isDeleted = false,
  } = options;

  const { models, user } = context;

  let search = { isArchived, isDeleted };
  let searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['name'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
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

  const count = await models.Cohort.countDocuments(search);

  const totalPages = getTotalPages(count);

  const cohorts = await models.Cohort.find(search, null, searchOptions).sort(sort);

  return {
    cohorts,
    count,
    currentPage,
    totalPages
  };

};