import setScenarioHasChanges from "../../scenarios/services/setScenarioHasChanges.js";

export default async (props, options, context) => {

  const { blockId } = props;

  const { models, user } = context;

  const block = await models.Block.findByIdAndUpdate(blockId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!block) throw { message: 'This block does not exist', statusCode: 404 };

  const slideBlocks = await models.Block.find({ scenario: block.scenario, slideRef: block.slideRef, isDeleted: false }).sort('sortOrder');

  let sortOrder = 0;
  for (const slideBlock of slideBlocks) {
    slideBlock.sortOrder = sortOrder;
    sortOrder++;
    await slideBlock.save();
  }

  setScenarioHasChanges({ scenarioId: block.scenario }, {}, context);

  return block;

};