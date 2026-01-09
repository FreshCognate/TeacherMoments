export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models, user } = context;

  const archivedAt = new Date();

  const result = await models.Run.updateMany(
    {
      scenario: scenarioId,
      user: user._id,
      isDeleted: false,
      isArchived: false
    },
    {
      isArchived: true,
      archivedAt
    }
  );

  return {
    archivedCount: result.modifiedCount,
    archivedAt
  };

};
