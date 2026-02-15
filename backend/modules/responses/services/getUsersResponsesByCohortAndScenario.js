import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';

export default async (props, options, context) => {

  const { cohortId, scenarioId } = props;
  let { searchValue = '', currentPage = 1 } = options;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const scenario = await models.Scenario.findById(scenarioId).lean();

  let search = { 'cohorts.cohort': cohortId };
  let searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['username'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  const count = await models.User.countDocuments(search);
  const totalPages = getTotalPages(count);
  const users = await models.User.find(search, null, searchOptions).lean();

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  let responses = [];

  for (const user of users) {
    const response = await buildUserScenarioResponse({ userId: user._id, scenarioId, slidesByRef, blocksByRef }, context);
    responses.push({ user, scenario, ...response });
  }

  return {
    scenario,
    responses,
    count,
    currentPage,
    totalPages
  };

};
