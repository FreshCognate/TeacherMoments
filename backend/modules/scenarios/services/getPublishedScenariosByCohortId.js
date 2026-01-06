import mongoose from 'mongoose';
import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';

export default async (props, options, context) => {

  const {
    cohortId
  } = props;

  let {
  } = options;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const { models, user } = context;

  const scenarios = await models.Scenario.aggregate([{
    $match: {
      "cohorts.cohort": mongoose.Types.ObjectId.createFromHexString(cohortId),
      isDeleted: false
    }
  }, {
    $addFields: {
      filteredCohorts: {
        $filter: {
          input: "$cohorts",
          as: "cohort",
          cond: { $eq: ["$$cohort.cohort", mongoose.Types.ObjectId.createFromHexString(cohortId)] }
        }
      }
    }
  }, {
    $addFields: {
      cohortSortValue: {
        $arrayElemAt: ["$filteredCohorts.sortOrder", 0]
      }
    }
  }, {
    $sort: {
      cohortSortValue: 1
    }
  }, {
    $project: {
      filteredCohorts: 0,
      cohortSortValue: 0,
    }
  }]);

  return {
    scenarios
  };

};