import getScenarioSlidesAndBlocksByRef from '../../responses/helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../../responses/helpers/buildUserScenarioResponse.js';
import getUserDisplayName from '#core/users/helpers/getUserDisplayName.js';
import formatTimeSpent from '../../scenarios/helpers/formatTimeSpent.js';
import sortBy from 'lodash/sortBy.js';
import find from 'lodash/find.js';
import map from 'lodash/map.js';

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

const isFirstBlockOfSlide = (blockColumns, index) => {
  return index === 0 || blockColumns[index].slideRef !== blockColumns[index - 1].slideRef;
};

export default async ({ scenarioId, users, models }) => {

  const context = { models };
  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  const blockColumns = sortBy(
    map(Object.values(blocksByRef), (block) => {
      const slide = slidesByRef[String(block.slideRef)] || {};
      return {
        ref: String(block.ref),
        slideRef: String(block.slideRef),
        slideName: slide.name,
        slideSortOrder: slide.sortOrder ?? 0,
        name: block.name,
        blockType: block.blockType,
        inputType: block.inputType,
        sortOrder: block.sortOrder
      };
    }),
    ['slideSortOrder', 'sortOrder']
  );

  const rows = [];

  const headerRow = ['Username', 'Row Type'];
  for (const blockColumn of blockColumns) {
    const prefix = blockColumn.slideName ? `${blockColumn.slideName} - ` : '';
    headerRow.push(prefix + (blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`));
  }
  headerRow.push('Total Time');
  rows.push(headerRow);

  for (const user of users) {
    const response = await buildUserScenarioResponse(
      { userId: user._id, scenarioId, slidesByRef, blocksByRef }, context
    );

    const displayName = getUserDisplayName(user);

    const valueRow = [displayName, 'Value'];
    for (const blockColumn of blockColumns) {
      const blockResponse = find(response.blockResponses, { ref: blockColumn.ref });
      valueRow.push(getBlockValue(blockResponse));
    }
    valueRow.push(formatTimeSpent(response.totalTimeSpentMs));
    rows.push(valueRow);

    const feedbackRow = ['', 'Feedback'];
    for (let i = 0; i < blockColumns.length; i++) {
      const blockColumn = blockColumns[i];
      const stage = find(response.stages, { slideRef: blockColumn.slideRef });
      const showOnThisColumn = isFirstBlockOfSlide(blockColumns, i);
      if (showOnThisColumn && stage?.feedbackItems?.length > 0) {
        feedbackRow.push(stage.feedbackItems.join('; '));
      } else {
        feedbackRow.push('');
      }
    }
    feedbackRow.push('');
    rows.push(feedbackRow);

    const timeRow = ['', 'Time'];
    for (let i = 0; i < blockColumns.length; i++) {
      const blockColumn = blockColumns[i];
      const stage = find(response.stages, { slideRef: blockColumn.slideRef });
      const showOnThisColumn = isFirstBlockOfSlide(blockColumns, i);
      if (showOnThisColumn && stage?.timeSpentMs != null) {
        timeRow.push(formatTimeSpent(stage.timeSpentMs));
      } else {
        timeRow.push('');
      }
    }
    timeRow.push('');
    rows.push(timeRow);
  }

  return rows;

};
