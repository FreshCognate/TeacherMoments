import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';

export default async (props, options, context) => {

  const { userId, cohortId } = props;
  let { searchValue = '', currentPage = 1 } = options;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const user = await models.User.findOne({ _id: userId, 'cohorts.cohort': cohortId }).lean();

  if (!user) {
    throw { message: 'User is not in this cohort', statusCode: 404 };
  }

  let search = { 'cohorts.cohort': cohortId, isDeleted: false };
  let searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['name'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  const count = await models.Scenario.countDocuments(search);
  const totalPages = getTotalPages(count);
  const scenarios = await models.Scenario.find(search, null, searchOptions).sort('name').lean();

  let responses = [];

  for (const scenario of scenarios) {
    const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId: scenario._id }, context);
    const response = await buildUserScenarioResponse({ user, scenarioId: scenario._id, scenarioName: scenario.name, slidesByRef, blocksByRef }, context);
    responses.push(response);
  }

  return {
    user,
    responses,
    count,
    currentPage,
    totalPages
  };

};
