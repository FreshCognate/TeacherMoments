export default async (props, options, context) => {
  const { publishLink } = props;

  const { models } = context;

  const scenario = await models.Scenario.findOne({ publishLink: publishLink, isDeleted: false });

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404 };

  if (!scenario.isPublished) throw { message: 'This scenario is not published', statusCode: 404 };

  return scenario;

}