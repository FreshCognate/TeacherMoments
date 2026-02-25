import checkHasAccessToViewCohort from '../helpers/checkHasAccessToViewCohort.js';
import map from 'lodash/map.js';
import intersection from 'lodash/intersection.js';
import reduce from 'lodash/reduce.js';
import mongoose from 'mongoose';

export default async (props, options, context) => {

  const { cohortId } = props;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const scenarios = await models.Scenario.find({ 'cohorts.cohort': cohortId, isDeleted: false }).lean();
  const scenarioIds = map(scenarios, '_id');

  const totalUsers = await models.User.countDocuments({ 'cohorts.cohort': mongoose.Types.ObjectId.createFromHexString(cohortId), isDeleted: false });

  if (scenarioIds.length === 0) {
    return {
      totalUsers,
      scenarioCompletions: [],
      cohortCompletionCount: 0
    };
  }

  const completionAggregation = await models.Run.aggregate([
    {
      $match: {
        scenario: { $in: scenarioIds },
        isComplete: true,
        isDeleted: false
      }
    },
    {
      $group: {
        _id: { scenario: '$scenario', user: '$user' }
      }
    },
    {
      $group: {
        _id: '$_id.scenario',
        completedUsers: { $addToSet: '$_id.user' },
        completedCount: { $sum: 1 }
      }
    }
  ]);

  const scenarioCompletions = map(completionAggregation, (item) => ({
    scenarioId: String(item._id),
    completedCount: item.completedCount
  }));

  let cohortCompletionCount = 0;

  if (completionAggregation.length === scenarioIds.length && scenarioIds.length > 0) {
    const userSets = map(completionAggregation, (item) => {
      return map(item.completedUsers, (userId) => String(userId));
    });
    const usersWhoCompletedAll = reduce(userSets, (result, userSet) => {
      return intersection(result, userSet);
    });
    cohortCompletionCount = usersWhoCompletedAll.length;
  }

  return {
    totalUsers,
    scenarioCompletions,
    cohortCompletionCount
  };

};
