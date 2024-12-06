export default async (props, options, context) => {

  const { name, scenario } = props;

  const { models, user } = context;

  if (!name) throw { message: "A slide must have a name", statusCode: 400 };

  const newSlideObject = {
    name,
    scenario,
    createdBy: user._id,
  };

  const slide = await models.Slide.create(newSlideObject);

  return slide;

};