import React from 'react';
import map from 'lodash/map';
import each from 'lodash/each';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Icon from '~/uikit/icons/components/icon';
import FlatButton from '~/uikit/buttons/components/flatButton';
import formatTimeSpent from '../helpers/formatTimeSpent';
import { AnalyticsViewType, BlockResponse, StageResponse, UserResponse } from '../analytics.types';

interface SlideResponseGroup {
  slideRef: string;
  slideName?: string;
  slideSortOrder: number;
  promptResponses: BlockResponse[];
  firstBlockRef: string;
}

interface AnalyticsResponsesItemProps {
  viewType: AnalyticsViewType;
  response: UserResponse;
  isSelected: boolean;
  selectedBlockResponseRef: string | null;
  selectedSlideRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSlideNavigated: (slideRef: string) => void;
  onBlockNavigated: (blockRef: string) => void;
  onSummarizeUser: (response: UserResponse) => void;
}

const getSlideResponseGroups = (blockResponses: BlockResponse[]): SlideResponseGroup[] => {
  const groupMap: Record<string, SlideResponseGroup> = {};
  const slideOrder: string[] = [];

  each(blockResponses, (blockResponse) => {
    const { slideRef } = blockResponse;
    if (!groupMap[slideRef]) {
      groupMap[slideRef] = {
        slideRef,
        slideName: blockResponse.slideName,
        slideSortOrder: blockResponse.slideSortOrder,
        promptResponses: [],
        firstBlockRef: blockResponse.ref
      };
      slideOrder.push(slideRef);
    }
    if (getBlockDisplayType(blockResponse) === 'PROMPT') {
      groupMap[slideRef].promptResponses.push(blockResponse);
    }
  });

  return map(slideOrder, (slideRef) => groupMap[slideRef]);
};

const getColumnCount = (slideGroups: SlideResponseGroup[]): number => {
  return reduce(slideGroups, (total, group) => total + Math.max(1, group.promptResponses.length), 0);
};

const getStageForSlide = (stages: StageResponse[] | undefined, slideRef: string): StageResponse | undefined => {
  return find(stages, { slideRef });
};

const labelClass = 'sticky left-0 z-10 bg-lm-2 dark:bg-dm-3 px-4 py-3 text-xs text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2';
const subLabelClass = 'sticky left-0 z-10 bg-lm-1 dark:bg-dm-2 px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';
const subCellClass = 'px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';

const isSlideSelected = (slideGroup: SlideResponseGroup, selectedSlideRef: string | null, selectedBlockResponseRef: string | null): boolean => {
  if (selectedSlideRef === slideGroup.slideRef) return true;
  if (selectedBlockResponseRef && slideGroup.promptResponses.some((pr) => pr.ref === selectedBlockResponseRef)) return true;
  return false;
};

const AnalyticsResponsesItem: React.FC<AnalyticsResponsesItemProps> = ({
  viewType,
  response,
  isSelected,
  selectedBlockResponseRef,
  selectedSlideRef,
  onResponseClicked,
  onSlideNavigated,
  onBlockNavigated,
  onSummarizeUser
}) => {
  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="bg-lm-1 dark:bg-dm-2 px-4 py-3 font-semibold border-b border-lm-3 dark:border-dm-2 break-words flex items-center gap-4">
        <span>
          {viewType === 'byUserScenarios'
            ? response.scenario?.name || 'Unknown scenario'
            : `Participant: ${getUserDisplayName(response.user)}`
          }
        </span>
        <FlatButton
          text="Summarize user"
          icon="ai"
          size="sm"
          className="font-normal text-xs"
          ariaLabel="Summarize user"
          onClick={() => onSummarizeUser(response)}
        />
      </div>

      {response.blockResponses && response.blockResponses.length > 0 ? (() => {
        const slideGroups = getSlideResponseGroups(response.blockResponses);
        const columnCount = getColumnCount(slideGroups);
        const gridColumns = `auto repeat(${columnCount}, minmax(18rem, 1fr))`;

        return (
          <div className="overflow-x-auto">
            <div
              className="grid w-fit min-w-full"
              style={{ gridTemplateColumns: gridColumns }}
            >
              {/* Row 1: Slide headers */}
              <div className={classnames(labelClass, 'text-sm font-bold text-black/80 dark:text-white/80 bg-lm-2 dark:bg-dm-3')}>
                Slide
              </div>
              {map(slideGroups, (slideGroup) => {
                const colSpan = Math.max(1, slideGroup.promptResponses.length);
                const slideSelected = isSlideSelected(slideGroup, selectedSlideRef, selectedBlockResponseRef);
                return (
                  <div
                    key={`slide-${slideGroup.slideRef}`}
                    className={classnames(
                      'px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer',
                      slideSelected
                        ? 'bg-primary-light/10 dark:bg-primary-light/10 hover:bg-primary-light/20 dark:hover:bg-primary-light/20'
                        : 'bg-lm-2 dark:bg-dm-3 hover:bg-lm-1 dark:hover:bg-dm-2'
                    )}
                    style={{ gridColumn: `span ${colSpan}` }}
                    onClick={() => {
                      onResponseClicked(response, slideGroup.firstBlockRef);
                      onSlideNavigated(slideGroup.slideRef);
                    }}
                  >
                    {slideGroup.slideName || `Slide ${slideGroup.slideSortOrder + 1}`}
                  </div>
                );
              })}

              {/* Row 2: Block names */}
              <div className={classnames(labelClass, 'text-sm font-bold text-black/80 dark:text-white/80 bg-lm-2 dark:bg-dm-3')}>
                Block
              </div>
              {map(slideGroups, (slideGroup) => {
                if (slideGroup.promptResponses.length === 0) {
                  return (
                    <div
                      key={`name-empty-${slideGroup.slideRef}`}
                      className="px-4 py-2 text-sm text-black/30 dark:text-white/30 bg-lm-2 dark:bg-dm-3 border-r border-b border-lm-3 dark:border-dm-2"
                    >
                      No prompts
                    </div>
                  );
                }
                return map(slideGroup.promptResponses, (blockResponse) => (
                  <div
                    key={`name-${blockResponse.ref}`}
                    className={classnames(
                      'px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer',
                      selectedBlockResponseRef === blockResponse.ref
                        ? 'bg-primary-light/10 dark:bg-primary-light/10 hover:bg-primary-light/20 dark:hover:bg-primary-light/20'
                        : 'bg-lm-2 dark:bg-dm-3 hover:bg-lm-1 dark:hover:bg-dm-2'
                    )}
                    onClick={() => {
                      onResponseClicked(response, blockResponse.ref);
                      onBlockNavigated(blockResponse.ref);
                    }}
                  >
                    {blockResponse.name || `Block ${blockResponse.sortOrder + 1}`}
                  </div>
                ));
              })}

              {/* Row 3: Block types */}
              <div className={classnames(labelClass, 'text-sm font-bold text-black/80 dark:text-white/80 bg-lm-2 dark:bg-dm-3 border-b-2')}>
                Type
              </div>
              {map(slideGroups, (slideGroup) => {
                if (slideGroup.promptResponses.length === 0) {
                  return (
                    <div
                      key={`type-empty-${slideGroup.slideRef}`}
                      className="px-4 py-3 text-sm text-black/30 dark:text-white/30 bg-lm-2 dark:bg-dm-3 border-r border-b-2 border-lm-3 dark:border-dm-2"
                    >
                      —
                    </div>
                  );
                }
                return map(slideGroup.promptResponses, (blockResponse) => (
                  <div
                    key={`type-${blockResponse.ref}`}
                    className="px-4 py-3 text-sm text-black/60 dark:text-white/60 bg-lm-2 dark:bg-dm-3 border-r border-b-2 border-lm-3 dark:border-dm-2"
                  >
                    {blockResponse.blockType === 'INPUT_PROMPT' && (
                      <Icon
                        icon={blockResponse.inputType === 'AUDIO' ? 'audioPrompt' : 'textPrompt'}
                        size={16}
                        className="inline-block mr-2 align-text-bottom"
                      />
                    )}
                    {getBlockDisplayName(blockResponse)}
                    {blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' ? ' - audio' : ''}
                  </div>
                ));
              })}

              {/* Row 4: Values */}
              <div className={subLabelClass}>
                Value
              </div>
              {map(slideGroups, (slideGroup) => {
                if (slideGroup.promptResponses.length === 0) {
                  return (
                    <div
                      key={`val-empty-${slideGroup.slideRef}`}
                      className="px-4 py-3 text-sm text-black/30 dark:text-white/30 border-r border-b border-lm-3 dark:border-dm-2"
                    >
                      —
                    </div>
                  );
                }
                return map(slideGroup.promptResponses, (blockResponse) => {
                  const isBlockSelected = isSelected && selectedBlockResponseRef === blockResponse.ref;
                  return (
                    <div
                      key={`val-${blockResponse.ref}`}
                      id={`block-response-${blockResponse.ref}`}
                      className={classnames(
                        'px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer',
                        isBlockSelected
                          ? 'outline outline-2 -outline-offset-2 outline-primary-regular hover:bg-primary-light/10 dark:hover:bg-primary-light/10'
                          : 'hover:bg-lm-1 dark:hover:bg-dm-2'
                      )}
                      onClick={() => onResponseClicked(response, blockResponse.ref)}
                    >
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
                  );
                });
              })}

              {/* Row 5: Feedback (spanning slide width) */}
              <div className={subLabelClass}>
                Feedback
              </div>
              {map(slideGroups, (slideGroup) => {
                const colSpan = Math.max(1, slideGroup.promptResponses.length);
                const stage = getStageForSlide(response.stages, slideGroup.slideRef);
                const hasFeedback = stage?.feedbackItems && stage.feedbackItems.length > 0;
                return (
                  <div
                    key={`fb-${slideGroup.slideRef}`}
                    className={subCellClass}
                    style={{ gridColumn: `span ${colSpan}` }}
                  >
                    {hasFeedback && (
                      <div className="line-clamp-2">{stage!.feedbackItems!.join('; ')}</div>
                    )}
                  </div>
                );
              })}

              {/* Row 6: Time (spanning slide width) */}
              <div className={subLabelClass}>
                Time: {formatTimeSpent(response.totalTimeSpentMs)}
              </div>
              {map(slideGroups, (slideGroup) => {
                const colSpan = Math.max(1, slideGroup.promptResponses.length);
                const stage = getStageForSlide(response.stages, slideGroup.slideRef);
                return (
                  <div
                    key={`time-${slideGroup.slideRef}`}
                    className={subCellClass}
                    style={{ gridColumn: `span ${colSpan}` }}
                  >
                    {stage?.timeSpentMs != null && (
                      <span>{formatTimeSpent(stage.timeSpentMs)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })() : (
        <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
          No block responses
        </div>
      )}
    </div>
  );
};

export default AnalyticsResponsesItem;
