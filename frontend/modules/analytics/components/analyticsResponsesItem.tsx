import React from 'react';
import map from 'lodash/map';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsResponsesItemProps {
  viewType: AnalyticsViewType;
  response: UserResponse;
  isSelected: boolean;
  selectedBlockResponseRef: string | null;
  onResponseClicked: (response: UserResponse, blockResponseRef: string) => void;
}

const AnalyticsResponsesItem: React.FC<AnalyticsResponsesItemProps> = ({
  viewType,
  response,
  isSelected,
  selectedBlockResponseRef,
  onResponseClicked
}) => {
  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="bg-lm-1 dark:bg-dm-2 px-4 py-3 font-semibold border-b border-lm-3 dark:border-dm-2">
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
              gridTemplateRows: 'auto auto auto'
            }}
          >
            <div className="row-span-3 grid grid-rows-subgrid sticky left-0 z-10 min-w-28 bg-lm-2 dark:bg-dm-3">
              <div className="px-4 py-2 text-left text-xs font-medium text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                Block ID
              </div>
              <div className="px-4 py-3 text-xs text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                Block type
              </div>
              <div className="px-4 py-3 text-xs text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                Answer
              </div>
            </div>

            {map(response.blockResponses, (blockResponse, brIndex) => (
              <div
                key={brIndex}
                id={`block-response-${blockResponse.ref}`}
                className={classnames('row-span-3 grid grid-rows-subgrid scroll-ml-28 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-2', {
                  'outline outline-2 -outline-offset-2 outline-primary-regular': isSelected && selectedBlockResponseRef === blockResponse.ref
                })}
                onClick={() => onResponseClicked(response, blockResponse.ref)}
              >
                <div className="px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 bg-lm-2 dark:bg-dm-3 border-r border-b border-lm-3 dark:border-dm-2">
                  {blockResponse.slideName ? `${blockResponse.slideName} - ` : ''}{blockResponse.name || blockResponse.ref || `Block ${blockResponse.sortOrder + 1}`}
                </div>
                <div className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                  {getBlockDisplayName(blockResponse)}
                </div>
                <div className="px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
                  {(blockResponse.blockType === 'MULTIPLE_CHOICE_PROMPT') && (
                    <div>
                      {blockResponse.selectedOptions}
                    </div>
                  )}
                  {(blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'TEXT') && (
                    <div>
                      {blockResponse.textValue}
                    </div>
                  )}
                  {(blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' && blockResponse.audio) && (
                    <div>
                      {blockResponse.audio.transcript}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
