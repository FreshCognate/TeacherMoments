import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async (props, options, context) => {

  const { cohortId } = props;

  let { searchValue = '', currentPage = 1, isDeleted = false } = options;

  const { models, user } = context;

  const search = {
    "cohorts.cohort": cohortId,
    isDeleted
  };
  const searchOptions = {};

  const isSuperAdmin = hasUserGotPermissions(user, ['SUPER_ADMIN']);

  if (!isSuperAdmin) {
    search.role = { $ne: 'SUPER_ADMIN' };
  }

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['firstName', 'lastName', 'email'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  const count = await models.User.countDocuments(search);

  const totalPages = getTotalPages(count);

  const users = await models.User.find(search, null, searchOptions).sort('lastName');

  return {
    users,
    count,
    currentPage,
    totalPages
  };

};