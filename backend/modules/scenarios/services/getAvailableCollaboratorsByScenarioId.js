import checkHasAccessToScenario from '../helpers/checkHasAccessToScenario.js';
import getModelPaginationByCurrentPage from "#core/app/helpers/getModelPaginationByCurrentPage.js";
import getSearchFromSearchValue from "#core/app/helpers/getSearchFromSearchValue.js";
import getTotalPages from "#core/app/helpers/getTotalPages.js";
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models } = context;

  let { searchValue = '', currentPage = 1 } = options;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const scenario = await models.Scenario.findById(scenarioId);

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  const currentScenarioCollaborators = map(scenario.collaborators, 'user');

  const search = { _id: { $nin: currentScenarioCollaborators }, isDeleted: false };

  const searchOptions = {};

  if (searchValue.length) {
    getSearchFromSearchValue(searchValue, ['firstName', 'lastName', 'email'], search);
  }

  if (currentPage) {
    currentPage = parseInt(currentPage);
    getModelPaginationByCurrentPage(currentPage, searchOptions);
  }

  const count = await models.User.countDocuments(search);

  const totalPages = getTotalPages(count);

  const availableCollaborators = await models.User.find(search, null, searchOptions).sort('lastName');

  return {
    collaborators: availableCollaborators,
    count,
    currentPage,
    totalPages
  }

};