import getUsersByCohortId from '#core/users/services/getUsersByCohortId.js';
import checkHasAccessToViewCohort from '../../cohorts/helpers/checkHasAccessToViewCohort.js';
import populateRun from "../../runs/helpers/populateRun.js";
import find from 'lodash/find.js';

export default async (props, options, context) => {

  const { cohortId, scenarioId } = props;
  const { models } = context;

  await checkHasAccessToViewCohort({ cohortId }, context);

  const cohortUsers = await getUsersByCohortId({ cohortId }, {}, context);

  let responses = [];

  const scenarioSlides = await models.Slide.find({ scenario: scenarioId, isDeleted: false });

  const scenarioSlidesByRef = {};

  for (const scenarioSlide of scenarioSlides) {
    scenarioSlidesByRef[String(scenarioSlide.ref)] = scenarioSlide;
  }

  const scenarioBlocks = await models.Block.find({ scenario: scenarioId, isDeleted: false });

  const scenarioBlocksByRef = {};

  for (const scenarioBlock of scenarioBlocks) {
    scenarioBlocksByRef[String(scenarioBlock.ref)] = scenarioBlock;
  }

  for (const user of cohortUsers.users) {
    let previousUserRuns = await models.Run.find({ scenario: scenarioId, user: user._id, isDeleted: false, isArchived: true }).sort('createdAt').lean();
    let userRun = await models.Run.findOne({ scenario: scenarioId, user: user._id, isDeleted: false, isArchived: false }).lean();

    let currentRun = {
      hasStarted: false,
      isComplete: false,
      hasBeenCompleted: find(previousUserRuns, { isComplete: true }),
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

            const block = scenarioBlocksByRef[blockByRefKey];
            const blockTracking = stage.blocksByRef[blockByRefKey];
            const blockSlide = scenarioSlidesByRef[String(block.slideRef)] || {};

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
    let response = {
      username: user.username,
      role: user.role,
      ...currentRun
    };
    responses.push(response);
  }

  return {
    responses
  };

};