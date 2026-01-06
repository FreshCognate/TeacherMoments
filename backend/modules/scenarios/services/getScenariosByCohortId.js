import mongoose from 'mongoose';
import checkHasAccessToEditCohort from '../../cohorts/helpers/checkHasAccessToEditCohort.js';

export default async (props, options, context) => {

  const {
    cohortId
  } = props;

  let {
  } = options;

  await checkHasAccessToEditCohort({ cohortId }, context);

  const { models, user } = context;

  const scenarios = await models.Scenario.aggregate([{
    $match: {
      "cohorts.cohort": new mongoose.Types.ObjectId(cohortId),
      isDeleted: false
    }
  }, {
    $addFields: {
      filteredCohorts: {
        $filter: {
          input: "$cohorts",
          as: "cohort",
          cond: { $eq: ["$$cohort.cohort", new mongoose.Types.ObjectId(cohortId)] }
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