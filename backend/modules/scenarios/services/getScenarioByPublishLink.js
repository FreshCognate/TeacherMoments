export default async (props, options, context) => {
  const { publishLink } = props;

  const { models } = context;

  const scenario = await models.Published_Scenario.findOne({ publishLink: publishLink, isDeleted: false });

  if (!scenario) throw { message: 'This scenario does not exist', statusCode: 404, shouldRedirectToScenarios: true };

  if (!scenario.isPublished) throw { message: 'This scenario is not published', statusCode: 404, shouldRedirectToScenarios: true };

  return scenario;

}