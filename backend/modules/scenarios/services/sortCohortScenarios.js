import checkHasAccessToEditCohort from '../../cohorts/helpers/checkHasAccessToEditCohort.js';
import getScenarioCollaboratorsPopulate from '../helpers/getScenarioCollaboratorsPopulate.js';
import setScenarioHasChanges from './setScenarioHasChanges.js';

export default async (props, options, context) => {

  const { cohortId, scenarios } = props;
  const { models } = context;

  await checkHasAccessToEditCohort({ cohortId }, context);

  for (const scenario of scenarios) {

    await models.Scenario.findOneAndUpdate({ _id: scenario._id }, {
      $set: {
        "cohorts.$[item].sortOrder": scenario.sortOrder
      }
    }, {
      arrayFilters: [{
        "item.cohort": cohortId
      }]
    })
  }

  return {};

};