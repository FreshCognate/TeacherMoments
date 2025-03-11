export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted: false };

  const triggers = await models.Published_Trigger.find(search).sort('sortOrder');

  return {
    triggers
  };

};