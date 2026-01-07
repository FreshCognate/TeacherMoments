import checkHasAccessToViewCohort from "../../cohorts/helpers/checkHasAccessToViewCohort.js";
import map from 'lodash/map.js';

export default async (props, options, context) => {

  const {
    cohortId,
  } = props;

  const { models, user } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const cohortScenarios = await models.Scenario.find({ 'cohorts.cohort': cohortId, isDeleted: false });

  const cohortScenarioIds = map(cohortScenarios, (cohortScenario) => {
    return String(cohortScenario._id);
  });

  const runs = await models.Run.find({ scenario: { $in: cohortScenarioIds }, user: user._id, isDeleted: false });

  return {
    runs
  }

};