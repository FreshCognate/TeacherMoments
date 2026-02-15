import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';
import getTotalPages from '#core/app/helpers/getTotalPages.js';
import getModelPaginationByCurrentPage from '#core/app/helpers/getModelPaginationByCurrentPage.js';
import getSearchFromSearchValue from '#core/app/helpers/getSearchFromSearchValue.js';
import uniqBy from 'lodash/uniqBy.js';
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  let { searchValue = '', currentPage = 1 } = options;
  const { models } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const scenario = await models.Scenario.findById(scenarioId).lean();
  const runs = await models.Run.find({ scenario: scenarioId, isDeleted: false }).lean();

  const userIds = map(uniqBy(runs, 'user'), 'user');

  let search = { _id: { $in: userIds } };
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
    const response = await buildUserScenarioResponse({ user, scenarioId, slidesByRef, blocksByRef }, context);
    responses.push(response);
  }

  return {
    scenario,
    responses,
    count,
    currentPage,
    totalPages
  };

};
