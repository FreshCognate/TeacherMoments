import getUsersByCohortId from '#core/users/services/getUsersByCohortId.js';
import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../helpers/buildUserScenarioResponse.js';

export default async (props, options, context) => {

  const { cohortId, scenarioId } = props;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const cohortUsers = await getUsersByCohortId({ cohortId }, {}, context);

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  let responses = [];

  for (const user of cohortUsers.users) {
    const response = await buildUserScenarioResponse({ user, scenarioId, slidesByRef, blocksByRef }, context);
    responses.push(response);
  }

  return {
    responses
  };

};
