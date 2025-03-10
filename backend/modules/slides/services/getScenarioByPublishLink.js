export default async (props, options, context) => {
  const { publishLink } = props;

  const { models } = context;

  const scenario = await models.Scenario.findOne({ publishLink: publishLink, isDeleted: false });

  if (!scenario.isPublished) throw { message: 'This scenario is not published', statusCode: 404 };

  return scenario;

}