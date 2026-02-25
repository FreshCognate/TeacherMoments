import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';

export default async (props, options, context) => {

  let { searchValue = '', currentPage = 1 } = options;
  const { models, user } = context;

  const scenarioIds = await models.Run.distinct('scenario', {
    user: user._id,
    isDeleted: false
  });

  let search = { _id: { $in: scenarioIds }, isDeleted: false };
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
    const response = await buildUserScenarioResponse({ userId: user._id, scenarioId: scenario._id, slidesByRef, blocksByRef }, context);
    responses.push({ user, scenario, ...response });
  }

  return {
    user,
    responses,
    count,
    currentPage,
    totalPages
  };

};
