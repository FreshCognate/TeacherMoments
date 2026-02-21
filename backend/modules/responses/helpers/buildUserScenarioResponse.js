import populateRun from '../../runs/helpers/populateRun.js';
import find from 'lodash/find.js';

export default async ({ userId, scenarioId, slidesByRef, blocksByRef }, context) => {

  const { models } = context;

  let previousUserRuns = await models.Run.find({ scenario: scenarioId, user: userId, isDeleted: false, isArchived: true }).sort('createdAt').lean();
  let userRun = await models.Run.findOne({ scenario: scenarioId, user: userId, isDeleted: false, isArchived: false }).lean();

  let currentRun = {
    scenarioId,
    hasStarted: false,
    isComplete: false,
    hasBeenCompleted: !!find(previousUserRuns, { isComplete: true }),
    previousRunsCount: previousUserRuns.length,
    blockResponses: []
  };

  if (userRun) {
    userRun = await populateRun({ run: userRun }, context);
    currentRun.hasStarted = true;
    currentRun.isComplete = userRun.isComplete;
    currentRun.blockResponses = [];
    if (userRun.stages && userRun.stages.length > 0) {
      for (const stage of userRun.stages) {
        for (const blockByRefKey of Object.keys(stage.blocksByRef)) {
          let blockResponse = {};

          const block = blocksByRef[blockByRefKey];
          const blockTracking = stage.blocksByRef[blockByRefKey];
          const blockSlide = slidesByRef[String(block.slideRef)] || {};

          blockResponse.ref = block.ref;
          blockResponse.slideRef = block.slideRef;
          blockResponse.slideName = blockSlide.name;

          blockResponse.sortOrder = block.sortOrder;
          blockResponse.blockType = block.blockType;
          blockResponse.inputType = block.inputType;
          blockResponse.mediaType = block.mediaType;
          blockResponse.suggestionType = block.suggestionType;

          blockResponse.selectedOptions = blockTracking.selectedOptions;
          blockResponse.textValue = blockTracking.textValue;
          blockResponse.audio = blockTracking.audio;

          currentRun.blockResponses.push(blockResponse);

        }
      }
    }
  }

  return currentRun;

};
