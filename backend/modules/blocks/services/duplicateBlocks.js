import duplicateBlock from './duplicateBlock.js';

export default async ({ scenarioId, slideRef, newScenarioId, newSlideRef }, context) => {

  const { models } = context;

  const blocks = await models.Block.find({ scenario: scenarioId, slideRef, isDeleted: false });

  for (const block of blocks) {
    await duplicateBlock({ blockId: block._id, newScenarioId, newSlideRef }, context);
  }

}