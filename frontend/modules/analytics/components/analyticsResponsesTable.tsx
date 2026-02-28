import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
import classnames from 'classnames';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import getUserDisplayName from '~/modules/users/helpers/getUserDisplayName';
import Icon from '~/uikit/icons/components/icon';
import { BlockColumn, BlockResponse, UserResponse } from '../analytics.types';

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
            gridTemplateColumns: `auto repeat(${blockColumns.length}, minmax(18rem, 1fr))`
          }}
        >
          {/* Row 1: Block ID */}
          <div className="sticky left-0 z-10 min-w-28 bg-lm-2 dark:bg-dm-3 px-4 py-2 text-left text-xs font-medium text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
            Block ID
          </div>
          {map(blockColumns, (blockColumn, index) => (
            <div key={`name-${index}`} className="px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 bg-lm-2 dark:bg-dm-3 border-r border-b border-lm-3 dark:border-dm-2">
              {blockColumn.slideName ? `${blockColumn.slideName} - ` : ''}{blockColumn.name || blockColumn.ref || `Block ${blockColumn.sortOrder + 1}`}
            </div>
          ))}

          {/* Row 2: Block type */}
          <div className="sticky left-0 z-10 min-w-28 bg-lm-2 dark:bg-dm-3 px-4 py-3 text-xs text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2">
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

          {/* User answer rows */}
          {map(responses, (response, responseIndex) => (
            <React.Fragment key={responseIndex}>
              <div className="sticky left-0 z-10 min-w-28 bg-lm-2 dark:bg-dm-3 px-4 py-3 text-sm font-medium text-black/80 dark:text-white/80 border-r border-b border-lm-3 dark:border-dm-2">
                {getUserDisplayName(response.user)}
              </div>
              {map(blockColumns, (blockColumn, blockIndex) => {
                const blockResponse = find(response.blockResponses, { ref: blockColumn.ref });
                const isSelected = selectedResponse === response && selectedBlockResponseRef === blockColumn.ref;

                return (
                  <div
                    key={blockIndex}
                    data-block-ref={blockColumn.ref}
                    data-user-id={response.user?._id}
                    className={classnames(
                      'px-4 py-3 text-sm text-black/60 dark:text-white/60 border-r border-b border-lm-3 dark:border-dm-2 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-2',
                      { 'outline outline-2 -outline-offset-2 outline-primary-regular': isSelected }
                    )}
                    onClick={() => onResponseClicked(response, blockColumn.ref)}
                  >
                    {renderBlockAnswer(blockResponse)}
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
