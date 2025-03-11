export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted: false };

  const slides = await models.Published_Slide.find(search);

  return {
    slides
  };

};