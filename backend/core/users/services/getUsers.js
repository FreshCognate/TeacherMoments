import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import hasUserGotPermissions from '#core/authentication/helpers/hasUserGotPermissions.js';

export default async ({ options: { searchValue = '', currentPage = 1, isDeleted = false } = {} }, context) => {

  const { models, user } = context;

  const search = {
    isDeleted
  };
  const options = {};

  const isSuperAdmin = hasUserGotPermissions(user, ['SUPER_ADMIN']);

  if (!isSuperAdmin) {
    search.role = { $ne: 'SUPER_ADMIN' };
  }

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['firstName', 'lastName', 'email'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, options);
  }

  const count = await models.User.countDocuments(search);

  const totalPages = getTotalPages(count);

  const users = await models.User.find(search, null, options).sort('lastName');

  return {
    users,
    count,
    currentPage,
    totalPages
  };

};