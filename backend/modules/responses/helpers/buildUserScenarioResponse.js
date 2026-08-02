import populateRun from '../../runs/helpers/populateRun.js';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import sortBy from 'lodash/sortBy.js';

const resolveSelectedOptionLabels = (block, selectedOptions) => {
  return map(selectedOptions, (selectedOption) => {
    const options = block.options || [];
    const option = find(options, (candidate) => String(candidate._id) === String(selectedOption)) ||
      find(options, (candidate) => candidate.value === selectedOption);

    if (!option) return String(selectedOption);

    return option.value || option['en-US-text'] || String(selectedOption);
  });
};

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
    blockResponses: [],
    totalTimeSpentMs: 0,
    stages: []
  };

  let trackingByRef = {};

  if (userRun) {
    userRun = await populateRun({ run: userRun }, context);
    currentRun.hasStarted = true;
    currentRun.isComplete = userRun.isComplete;
    currentRun.totalTimeSpentMs = userRun.totalTimeSpentMs || 0;
    currentRun.stages = map(userRun.stages, (stage) => ({
      slideRef: stage.slideRef,
      timeSpentMs: stage.timeSpentMs,
      feedbackItems: stage.feedbackItems || []
    }));
    if (userRun.stages && userRun.stages.length > 0) {
      for (const stage of userRun.stages) {
        for (const blockByRefKey of Object.keys(stage.blocksByRef)) {
          trackingByRef[blockByRefKey] = stage.blocksByRef[blockByRefKey];
        }
      }
    }
  }

  currentRun.blockResponses = sortBy(
    map(Object.values(blocksByRef), (block) => {
      const blockSlide = slidesByRef[String(block.slideRef)] || {};
      const blockTracking = trackingByRef[String(block.ref)];

      const blockResponse = {
        ref: block.ref,
        slideRef: block.slideRef,
        slideName: blockSlide.name,
        slideSortOrder: blockSlide.sortOrder ?? 0,
        name: block.name,
        sortOrder: block.sortOrder,
        blockType: block.blockType,
        inputType: block.inputType,
        mediaType: block.mediaType,
        suggestionType: block.suggestionType
      };

      if (blockTracking) {
        // selectedOptions stays as the stored option _ids (identity — used to
        // highlight the chosen answer when replaying a response). Labels are
        // exposed separately for read-only text display (tables, CSV, AI).
        blockResponse.selectedOptions = blockTracking.selectedOptions;
        blockResponse.selectedOptionLabels = blockTracking.selectedOptions
          ? resolveSelectedOptionLabels(block, blockTracking.selectedOptions)
          : blockTracking.selectedOptions;
        blockResponse.textValue = blockTracking.textValue;
        blockResponse.audio = blockTracking.audio;
      }

      return blockResponse;
    }),
    ['slideSortOrder', 'sortOrder']
  );

  return currentRun;

};
