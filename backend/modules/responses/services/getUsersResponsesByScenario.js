import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';
import uniqBy from 'lodash/uniqBy.js';
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models } = context;

  await checkHasAccessToScenario({ modelId: scenarioId, modelType: 'Scenario' }, context);

  const runs = await models.Run.find({ scenario: scenarioId, isDeleted: false }).lean();

  const userIds = map(uniqBy(runs, 'user'), 'user');

  const users = await models.User.find({ _id: { $in: userIds } }).lean();

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  let responses = [];

  for (const user of users) {
    const response = await buildUserScenarioResponse({ user, scenarioId, slidesByRef, blocksByRef }, context);
    responses.push(response);
  }

  return {
    responses
  };

};
