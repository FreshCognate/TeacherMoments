export default async (props, options, context) => {

  const {
    scenarioId,
  } = props;

  let {
    isDeleted = false
  } = options;

  const { models } = context;

  const search = { scenario: scenarioId, isDeleted };

  const slides = await models.Slide.find(search);

  return {
    slides
  };

};