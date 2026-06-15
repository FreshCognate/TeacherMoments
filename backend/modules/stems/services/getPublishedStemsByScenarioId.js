export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted: false };

  const stems = await models.Published_Stem.find(search);

  return {
    stems
  };

};
