import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Icon from '~/uikit/icons/components/icon';
import formatTimeSpent from '../helpers/formatTimeSpent';
import { BlockColumn, BlockResponse, StageResponse, UserResponse } from '../analytics.types';

interface AnalyticsResponsesTableProps {
  responses: UserResponse[];
  blockColumns: BlockColumn[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
}

const renderBlockAnswer = (blockResponse: BlockResponse | undefined) => {
  if (!blockResponse) return <span className="text-black/30 dark:text-white/30">-</span>;

  if (blockResponse.blockType === 'MULTIPLE_CHOICE_PROMPT') {
    return <div>{blockResponse.selectedOptions}</div>;
  }
  if (blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'TEXT') {
    return <div>{blockResponse.textValue}</div>;
  }
  if (blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' && blockResponse.audio) {
    return <div>{blockResponse.audio.transcript}</div>;
  }
  return null;
};

const isFirstBlockOfSlide = (blockColumns: BlockColumn[], index: number): boolean => {
  return index === 0 || blockColumns[index].slideRef !== blockColumns[index - 1].slideRef;
};

const getStageForBlock = (stages: StageResponse[] | undefined, blockColumn: BlockColumn): StageResponse | undefined => {
  return find(stages, { slideRef: blockColumn.slideRef });
};

const usernameHeaderClass = 'sticky left-0 z-20 bg-lm-2 dark:bg-dm-3 px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2';
const labelHeaderClass = 'sticky left-40 z-10 bg-lm-2 dark:bg-dm-3 px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2';
const usernameCellClass = 'sticky left-0 z-20 bg-lm-2 dark:bg-dm-3 px-4 py-3 text-sm font-medium text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2';
const subRowLabelClass = 'sticky left-40 z-10 bg-lm-1 dark:bg-dm-2 px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';
const subRowCellClass = 'px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';

const AnalyticsResponsesTable: React.FC<AnalyticsResponsesTableProps> = ({
  responses,
  blockColumns,
  selectedResponse,
  selectedBlockResponseRef,
  onResponseClicked
}) => {
  if (blockColumns.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
        No block responses
      </div>
    );
  }

  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div
          className="grid w-fit min-w-full"
          style={{
            gridTemplateColumns: `10rem 7rem repeat(${blockColumns.length}, minmax(18rem, 1fr))`
          }}
        >
          <div className={usernameHeaderClass} />
          <div className={labelHeaderClass}>
            Block ID
          </div>
          {map(blockColumns, (blockColumn, index) => (
            <div key={`name-${index}`} className="px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 bg-lm-2 dark:bg-dm-3 border-r border-b border-lm-3 dark:border-dm-2">
              {blockColumn.slideName ? `${blockColumn.slideName} - ` : ''}{blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`}
            </div>
          ))}

          <div className={classnames(usernameHeaderClass, 'py-3')}>
            Username
          </div>
          <div className={classnames(labelHeaderClass, 'py-3')}>
            Block type
          </div>
          {map(blockColumns, (blockColumn, index) => (
            <div key={`type-${index}`} className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
              {blockColumn.blockType === 'INPUT_PROMPT' && (
                <Icon icon={blockColumn.inputType === 'AUDIO' ? 'audioPrompt' : 'textPrompt'} size={16} className="inline-block mr-2 align-text-bottom" />
              )}
              {getBlockDisplayName(blockColumn)}{blockColumn.blockType === 'INPUT_PROMPT' && blockColumn.inputType === 'AUDIO' ? ' - audio' : ''}
            </div>
          ))}

          {map(responses, (response, responseIndex) => (
            <React.Fragment key={responseIndex}>
              <div
                className={usernameCellClass}
                style={{ gridRow: 'span 3' }}
              >
                {getUserDisplayName(response.user)}
              </div>
              <div className="row-span-3 grid grid-rows-subgrid sticky left-40 z-10">
                <div className={subRowLabelClass}>
                  Value
                </div>
                <div className={subRowLabelClass}>
                  Feedback
                </div>
                <div className={subRowLabelClass}>
                  Time: {formatTimeSpent(response.totalTimeSpentMs)}
                </div>
              </div>
              {map(blockColumns, (blockColumn, blockIndex) => {
                const blockResponse = find(response.blockResponses, { ref: blockColumn.ref });
                const stage = getStageForBlock(response.stages, blockColumn);
                const hasFeedback = stage?.feedbackItems && stage.feedbackItems.length > 0;
                const showOnThisColumn = isFirstBlockOfSlide(blockColumns, blockIndex);
                const isSelected = selectedResponse === response && selectedBlockResponseRef === blockColumn.ref;

                return (
                  <div
                    key={blockIndex}
                    data-block-ref={blockColumn.ref}
                    data-user-id={response.user?._id}
                    className={classnames(
                      'row-span-3 grid grid-rows-subgrid cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-2',
                      { 'outline outline-2 -outline-offset-2 outline-primary-regular': isSelected }
                    )}
                    onClick={() => onResponseClicked(response, blockColumn.ref)}
                  >
                    <div className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                      {renderBlockAnswer(blockResponse)}
                    </div>
                    <div className={subRowCellClass}>
                      {showOnThisColumn && hasFeedback && (
                        <div className="line-clamp-2">{stage!.feedbackItems!.join('; ')}</div>
                      )}
                    </div>
                    <div className={subRowCellClass}>
                      {showOnThisColumn && stage?.timeSpentMs != null && (
                        <span>{formatTimeSpent(stage.timeSpentMs)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsResponsesTable;
