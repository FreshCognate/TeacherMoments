import getScenarioSlidesAndBlocksByRef from '../../responses/helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../../responses/helpers/buildUserScenarioResponse.js';
import getUserDisplayName from '#core/users/helpers/getUserDisplayName.js';
import formatTimeSpent from '../../scenarios/helpers/formatTimeSpent.js';
import find from 'lodash/find.js';
import each from 'lodash/each.js';

const getBlockValue = (blockResponse) => {
  if (!blockResponse) return '';
  if (blockResponse.blockType === 'MULTIPLE_CHOICE_PROMPT') {
    return (blockResponse.selectedOptions || []).join(', ');
  }
  if (blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'TEXT') {
    return blockResponse.textValue || '';
  }
  if (blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO') {
    return blockResponse.audio?.transcript || '';
  }
  return '';
};

const isFirstBlockOfSlide = (blockResponses, index) => {
  return index === 0 || blockResponses[index].slideRef !== blockResponses[index - 1].slideRef;
};

export default async ({ scenarioId, users, models }) => {

  const context = { models };
  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  const rows = [];
  let headerBuilt = false;

  for (const user of users) {
    const response = await buildUserScenarioResponse(
      { userId: user._id, scenarioId, slidesByRef, blocksByRef }, context
    );

    const { blockResponses = [] } = response;

    if (!headerBuilt) {
      const headerRow = ['Username', 'Row Type'];
      each(blockResponses, (blockResponse) => {
        const prefix = blockResponse.slideName ? `${blockResponse.slideName} - ` : '';
        headerRow.push(prefix + (blockResponse.name || blockResponse.ref || `Block ${blockResponse.sortOrder + 1}`));
      });
      headerRow.push('Total Time');
      rows.push(headerRow);
      headerBuilt = true;
    }

    const displayName = getUserDisplayName(user);

    const valueRow = [displayName, 'Value'];
    each(blockResponses, (blockResponse) => {
      valueRow.push(getBlockValue(blockResponse));
    });
    valueRow.push(formatTimeSpent(response.totalTimeSpentMs));
    rows.push(valueRow);

    const feedbackRow = ['', 'Feedback'];
    each(blockResponses, (blockResponse, index) => {
      const stage = find(response.stages, (stageItem) => String(stageItem.slideRef) === String(blockResponse.slideRef));
      const showOnThisColumn = isFirstBlockOfSlide(blockResponses, index);
      if (showOnThisColumn && stage?.feedbackItems?.length > 0) {
        feedbackRow.push(stage.feedbackItems.join('; '));
      } else {
        feedbackRow.push('');
      }
    });
    feedbackRow.push('');
    rows.push(feedbackRow);

    const timeRow = ['', 'Time'];
    each(blockResponses, (blockResponse, index) => {
      const stage = find(response.stages, (stageItem) => String(stageItem.slideRef) === String(blockResponse.slideRef));
      const showOnThisColumn = isFirstBlockOfSlide(blockResponses, index);
      if (showOnThisColumn && stage?.timeSpentMs != null) {
        timeRow.push(formatTimeSpent(stage.timeSpentMs));
      } else {
        timeRow.push('');
      }
    });
    timeRow.push('');
    rows.push(timeRow);
  }

  return rows;

};
