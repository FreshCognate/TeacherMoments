import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { slideId, update } = props;

  const { models } = context;

  const slide = await models.Slide.findByIdAndUpdate(slideId, update, { new: true });

  if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

  setScenarioHasChanges({ scenarioId: slide.scenario }, {}, context);

  return slide;

};