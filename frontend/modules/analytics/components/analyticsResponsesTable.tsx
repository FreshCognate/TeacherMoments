import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
import some from 'lodash/some';
import reduce from 'lodash/reduce';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Icon from '~/uikit/icons/components/icon';
import FlatButton from '~/uikit/buttons/components/flatButton';
import formatTimeSpent from '../helpers/formatTimeSpent';
import { BlockColumn, BlockResponse, SlideGroup, StageResponse, UserResponse } from '../analytics.types';

interface AnalyticsResponsesTableProps {
  responses: UserResponse[];
  blockColumns: BlockColumn[];
  slideGroups: SlideGroup[];
  selectedResponse: UserResponse | null;
  selectedBlockResponseRef: string | null;
  selectedSlideRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
  onSlideNavigated: (slideRef: string) => void;
  onBlockNavigated: (blockRef: string) => void;
  onSummarizeSlide: (slideGroup: SlideGroup) => void;
  onSummarizeScenario: () => void;
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

const getStageForSlide = (stages: StageResponse[] | undefined, slideRef: string): StageResponse | undefined => {
  return find(stages, { slideRef });
};

const getColumnCount = (slideGroups: SlideGroup[]): number => {
  return reduce(slideGroups, (total, group) => total + Math.max(1, group.promptColumns.length), 0);
};

const isSlideSelected = (slideGroup: SlideGroup, selectedSlideRef: string | null, selectedBlockResponseRef: string | null): boolean => {
  if (selectedSlideRef === slideGroup.slideRef) return true;
  if (selectedBlockResponseRef && some(slideGroup.promptColumns, { ref: selectedBlockResponseRef })) return true;
  return false;
};

const usernameHeaderClass = 'sticky left-0 z-10 bg-lm-2 dark:bg-dm-3 px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2';
const labelHeaderClass = 'sticky left-40 z-10 bg-lm-2 dark:bg-dm-3 px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2';
const usernameCellClass = 'sticky left-0 z-20 bg-lm-2 dark:bg-dm-3 px-4 py-3 text-sm font-medium text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2 break-words';
const subRowLabelClass = 'sticky left-40 z-10 bg-lm-1 dark:bg-dm-2 px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';
const subRowCellClass = 'px-4 py-2 text-xs text-black/40 dark:text-white/40 border-r border-b border-lm-3 dark:border-dm-2';

const AnalyticsResponsesTable: React.FC<AnalyticsResponsesTableProps> = ({
  responses,
  slideGroups,
  selectedResponse,
  selectedBlockResponseRef,
  selectedSlideRef,
  onResponseClicked,
  onSlideNavigated,
  onBlockNavigated,
  onSummarizeSlide,
  onSummarizeScenario
}) => {
  if (slideGroups.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
        No block responses
      </div>
    );
  }

  const columnCount = getColumnCount(slideGroups);
  const gridColumns = `10rem 7rem repeat(${columnCount}, minmax(18rem, 1fr))`;

  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-12rem)]">
        {/* Sticky header grid */}
        <div
          className="grid w-fit min-w-full sticky top-0 z-30 bg-lm-2 dark:bg-dm-3"
          style={{ gridTemplateColumns: gridColumns }}
        >
          {/* Row 1: Slide headers with AI summary buttons */}
          <div className={classnames(usernameHeaderClass, 'flex items-center justify-center')}>
            <FlatButton
              icon="ai"
              size="sm"
              text="Summarize"
              ariaLabel="Summarize scenario"
              onClick={onSummarizeScenario}
            />
          </div>
          <div className={labelHeaderClass}>
            Slide
          </div>
          {map(slideGroups, (slideGroup) => {
            const colSpan = Math.max(1, slideGroup.promptColumns.length);
            const isSelected = isSlideSelected(slideGroup, selectedSlideRef, selectedBlockResponseRef);

            return (
              <div
                key={`slide-${slideGroup.slideRef}`}
                className={classnames(
                  'px-4 py-2 text-left text-sm font-bold text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer flex items-center justify-between gap-2',
                  isSelected ? 'bg-primary-light/10 dark:bg-primary-light/10 hover:bg-primary-light/20 dark:hover:bg-primary-light/20' : 'bg-lm-2 dark:bg-dm-3 hover:bg-lm-1 dark:hover:bg-dm-2'
                )}
                style={{ gridColumn: `span ${colSpan}` }}
                onClick={() => onSlideNavigated(slideGroup.slideRef)}
              >
                <span>{slideGroup.slideName || `Slide ${slideGroup.slideSortOrder + 1}`}</span>
                {slideGroup.promptColumns.length > 0 && (
                  <FlatButton
                    icon="ai"
                    size="sm"
                    ariaLabel="Summarize slide"
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      onSummarizeSlide(slideGroup);
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Row 2: Block names (prompt columns) */}
          <div className={classnames(usernameHeaderClass, 'py-3')}>
            Username
          </div>
          <div className={classnames(labelHeaderClass, 'py-3')}>
            Block
          </div>
          {map(slideGroups, (slideGroup) => {
            if (slideGroup.promptColumns.length === 0) {
              return (
                <div
                  key={`name-empty-${slideGroup.slideRef}`}
                  className="px-4 py-2 text-left text-sm text-black/30 dark:text-white/30 border-r border-b border-lm-3 dark:border-dm-2 bg-lm-2 dark:bg-dm-3"
                >
                  No prompts
                </div>
              );
            }

            return map(slideGroup.promptColumns, (blockColumn) => (
              <div
                key={`name-${blockColumn.ref}`}
                className={classnames(
                  'px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer',
                  selectedBlockResponseRef === blockColumn.ref ? 'bg-primary-light/10 dark:bg-primary-light/10 hover:bg-primary-light/20 dark:hover:bg-primary-light/20' : 'bg-lm-2 dark:bg-dm-3 hover:bg-lm-1 dark:hover:bg-dm-2'
                )}
                onClick={() => onBlockNavigated(blockColumn.ref)}
              >
                {blockColumn.name || `Block ${blockColumn.sortOrder + 1}`}
              </div>
            ));
          })}

          {/* Row 3: Block types */}
          <div className={classnames(usernameHeaderClass, 'border-b-2')} />
          <div className={classnames(labelHeaderClass, 'py-3 border-b-2')}>
            Type
          </div>
          {map(slideGroups, (slideGroup) => {
            if (slideGroup.promptColumns.length === 0) {
              return (
                <div
                  key={`type-empty-${slideGroup.slideRef}`}
                  className="px-4 py-3 text-sm text-black/30 dark:text-white/30 border-r border-b-2 border-lm-3 dark:border-dm-2 bg-lm-2 dark:bg-dm-3"
                >
                  —
                </div>
              );
            }

            return map(slideGroup.promptColumns, (blockColumn) => (
              <div
                key={`type-${blockColumn.ref}`}
                className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b-2 border-lm-3 dark:border-dm-2 bg-lm-2 dark:bg-dm-3"
              >
                {blockColumn.blockType === 'INPUT_PROMPT' && (
                  <Icon
                    icon={blockColumn.inputType === 'AUDIO' ? 'audioPrompt' : 'textPrompt'}
                    size={16}
                    className="inline-block mr-2 align-text-bottom"
                  />
                )}
                {getBlockDisplayName(blockColumn)}
                {blockColumn.blockType === 'INPUT_PROMPT' && blockColumn.inputType === 'AUDIO' ? ' - audio' : ''}
              </div>
            ));
          })}
        </div>

        {/* Scrollable body grid */}
        <div
          className="grid w-fit min-w-full"
          style={{ gridTemplateColumns: gridColumns }}
        >
          {map(responses, (response, responseIndex) => (
            <React.Fragment key={responseIndex}>
              {/* Username cell spans all 3 sub-rows */}
              <div
                className={usernameCellClass}
                style={{ gridRow: 'span 3' }}
              >
                {getUserDisplayName(response.user)}
              </div>

              {/* Sub-row labels span all 3 sub-rows */}
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

              {/* Row 1 of response: Value cells (one per block column) */}
              {map(slideGroups, (slideGroup) => {
                if (slideGroup.promptColumns.length === 0) {
                  return (
                    <div
                      key={`val-empty-${slideGroup.slideRef}`}
                      className="px-4 py-3 text-sm text-black/30 dark:text-white/30 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-2"
                      onClick={() => onResponseClicked(response, slideGroup.firstBlockRef)}
                    >
                      —
                    </div>
                  );
                }

                return map(slideGroup.promptColumns, (blockColumn) => {
                  const blockResponse = find(response.blockResponses, { ref: blockColumn.ref });
                  const isBlockSelected = selectedResponse === response && selectedBlockResponseRef === blockColumn.ref;

                  return (
                    <div
                      key={`val-${blockColumn.ref}`}
                      data-block-ref={blockColumn.ref}
                      data-user-id={response.user?._id}
                      className={classnames(
                        'px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer',
                        isBlockSelected ? 'outline outline-2 -outline-offset-2 outline-primary-regular hover:bg-primary-light/10 dark:hover:bg-primary-light/10' : 'hover:bg-lm-1 dark:hover:bg-dm-2'
                      )}
                      onClick={() => onResponseClicked(response, blockColumn.ref)}
                    >
                      {renderBlockAnswer(blockResponse)}
                    </div>
                  );
                });
              })}

              {/* Row 2 of response: Feedback cells (one per slide, spanning slide width) */}
              {map(slideGroups, (slideGroup) => {
                const colSpan = Math.max(1, slideGroup.promptColumns.length);
                const stage = getStageForSlide(response.stages, slideGroup.slideRef);
                const hasFeedback = stage?.feedbackItems && stage.feedbackItems.length > 0;

                return (
                  <div
                    key={`fb-${slideGroup.slideRef}`}
                    className={subRowCellClass}
                    style={{ gridColumn: `span ${colSpan}` }}
                  >
                    {hasFeedback && (
                      <div className="line-clamp-2">{stage!.feedbackItems!.join('; ')}</div>
                    )}
                  </div>
                );
              })}

              {/* Row 3 of response: Time cells (one per slide, spanning slide width) */}
              {map(slideGroups, (slideGroup) => {
                const colSpan = Math.max(1, slideGroup.promptColumns.length);
                const stage = getStageForSlide(response.stages, slideGroup.slideRef);

                return (
                  <div
                    key={`time-${slideGroup.slideRef}`}
                    className={subRowCellClass}
                    style={{ gridColumn: `span ${colSpan}` }}
                  >
                    {stage?.timeSpentMs != null && (
                      <span>{formatTimeSpent(stage.timeSpentMs)}</span>
                    )}
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
