import getUsersByCohortId from '#core/users/services/getUsersByCohortId.js';
import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const { cohortId, scenarioId } = props;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const cohortUsers = await getUsersByCohortId({ cohortId }, {}, context);

  console.log(cohortUsers);

  const userIds = map(cohortUsers.users, '_id');

  console.log(userIds);

  return {
    responses: []
  };

};