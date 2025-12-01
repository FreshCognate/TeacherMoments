export default async (props, options, context) => {

  const {
    cohortId,
  } = props;

  const { models, user } = context;

  let search = { isDeleted: false };

  search['cohorts.cohort'] = cohortId;

  const count = await models.Scenario.countDocuments(search);

  return {
    count,
  };

};