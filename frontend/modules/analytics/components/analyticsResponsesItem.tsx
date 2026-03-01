import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Icon from '~/uikit/icons/components/icon';
import formatTimeSpent from '../helpers/formatTimeSpent';
import { AnalyticsViewType, BlockResponse, StageResponse, UserResponse } from '../analytics.types';

interface AnalyticsResponsesItemProps {
  viewType: AnalyticsViewType;
  response: UserResponse;
  isSelected: boolean;
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
}

const isFirstBlockOfSlide = (blockResponses: BlockResponse[], index: number): boolean => {
  return index === 0 || blockResponses[index].slideRef !== blockResponses[index - 1].slideRef;
};

const getStageForBlock = (stages: StageResponse[] | undefined, blockResponse: BlockResponse): StageResponse | undefined => {
  return find(stages, { slideRef: blockResponse.slideRef });
};

const labelClass = 'px-4 py-3 text-xs text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2';
const subLabelClass = 'px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';
const subCellClass = 'px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';

const AnalyticsResponsesItem: React.FC<AnalyticsResponsesItemProps> = ({
  viewType,
  response,
  isSelected,
  selectedBlockResponseRef,
  onResponseClicked
}) => {
  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="bg-lm-1 dark:bg-dm-2 px-4 py-3 font-semibold border-b border-lm-3 dark:border-dm-2 break-words">
        {viewType === 'byUserScenarios'
          ? response.scenario?.name || 'Unknown scenario'
          : `Participant: ${getUserDisplayName(response.user)}`
        }
      </div>

      {response.blockResponses && response.blockResponses.length > 0 ? (
        <div className="overflow-x-auto">
          <div
            className="grid w-fit min-w-full"
            style={{
              gridTemplateColumns: `auto repeat(${response.blockResponses.length}, minmax(18rem, 1fr))`,
              gridTemplateRows: 'auto auto auto auto auto'
            }}
          >
            <div className="row-span-5 grid grid-rows-subgrid sticky left-0 z-10 min-w-28 bg-lm-2 dark:bg-dm-3">
              <div className={classnames(labelClass, 'text-sm font-bold text-black/80 dark:text-white/80')}>
                Block ID
              </div>
              <div className={classnames(labelClass, 'text-sm font-bold text-black/80 dark:text-white/80')}>
                Block type
              </div>
              <div className={subLabelClass}>
                Value
              </div>
              <div className={subLabelClass}>
                Feedback
              </div>
              <div className={subLabelClass}>
                Time: {formatTimeSpent(response.totalTimeSpentMs)}
              </div>
            </div>

            {map(response.blockResponses, (blockResponse, brIndex) => {
              const stage = getStageForBlock(response.stages, blockResponse);
              const showSlideData = isFirstBlockOfSlide(response.blockResponses!, brIndex);
              const hasFeedback = stage?.feedbackItems && stage.feedbackItems.length > 0;

              return (
                <div
                  key={brIndex}
                  id={`block-response-${blockResponse.ref}`}
                  className="row-span-5 grid grid-rows-subgrid"
                >
                  <div className="px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 bg-lm-2 dark:bg-dm-3 border-r border-b border-lm-3 dark:border-dm-2">
                    {blockResponse.slideName ? `${blockResponse.slideName} - ` : ''}{blockResponse.name || blockResponse.ref || `Block ${blockResponse.sortOrder + 1}`}
                  </div>

                  <div className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                    {blockResponse.blockType === 'INPUT_PROMPT' && (
                      <Icon icon={blockResponse.inputType === 'AUDIO' ? 'audioPrompt' : 'textPrompt'} size={16} className="inline-block mr-2 align-text-bottom" />
                    )}
                    {getBlockDisplayName(blockResponse)}{blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' ? ' - audio' : ''}
                  </div>

                  <div
                    className={classnames(
                      'row-span-3 grid grid-rows-subgrid cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-2',
                      { 'outline outline-2 -outline-offset-2 outline-primary-regular': isSelected && selectedBlockResponseRef === blockResponse.ref }
                    )}
                    onClick={() => onResponseClicked(response, blockResponse.ref)}
                  >
                    <div className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                      {blockResponse.blockType === 'MULTIPLE_CHOICE_PROMPT' && (
                        <div>{blockResponse.selectedOptions}</div>
                      )}
                      {blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'TEXT' && (
                        <div>{blockResponse.textValue}</div>
                      )}
                      {blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' && blockResponse.audio && (
                        <div>{blockResponse.audio.transcript}</div>
                      )}
                    </div>
                    <div className={subCellClass}>
                      {showSlideData && hasFeedback && (
                        <div className="line-clamp-2">{stage!.feedbackItems!.join('; ')}</div>
                      )}
                    </div>
                    <div className={subCellClass}>
                      {showSlideData && stage?.timeSpentMs != null && (
                        <span>{formatTimeSpent(stage.timeSpentMs)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
          No block responses
        </div>
      )}
    </div>
  );
};

export default AnalyticsResponsesItem;
