import React from 'react';
import map from 'lodash/map';
import getBlockDisplayName from '~/modules/blocks/helpers/getBlockDisplayName';
import { AnalyticsViewType, UserResponse } from '../analytics.types';

interface AnalyticsResponsesItemProps {
  viewType: AnalyticsViewType;
  response: UserResponse;
}

const AnalyticsResponsesItem: React.FC<AnalyticsResponsesItemProps> = ({
  viewType,
  response
}) => {
  return (
    <div className="bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-2 rounded-lg overflow-hidden">
      <div className="bg-lm-1 dark:bg-dm-2 px-4 py-3 font-semibold border-b border-lm-3 dark:border-dm-2">
        {viewType === 'byUserScenarios'
          ? response.scenarioName || 'Unknown scenario'
          : `Participant: ${response.username || 'Anonymous'}`
        }
      </div>

      {response.blockResponses && response.blockResponses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-lm-2 dark:bg-dm-3">
                {map(response.blockResponses, (blockResponse, brIndex) => (
                  <th
                    key={brIndex}
                    className="px-4 py-2 text-left text-sm font-medium text-black/60 dark:text-white/60 border-r border-lm-3 dark:border-dm-2 last:border-r-0"
                  >
                    {blockResponse.slideName ? `${blockResponse.slideName} - ` : ''}{blockResponse.ref || `Block ${blockResponse.sortOrder + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {map(response.blockResponses, (blockResponse, brIndex) => (
                  <td
                    key={brIndex}
                    className="px-4 py-3 text-sm min-w-72 align-top text-black/60 dark:text-white/60 border-r border-lm-3 dark:border-dm-2 last:border-r-0"
                  >
                    <div>
                      {`Type: ${getBlockDisplayName(blockResponse)}`}
                    </div>
                    {(blockResponse.blockType === 'MULTIPLE_CHOICE_PROMPT') && (
                      <div>
                        {`Selected options: ${blockResponse.selectedOptions}`}
                      </div>
                    )}
                    {(blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'TEXT') && (
                      <div>
                        {`Answer: ${blockResponse.textValue}`}
                      </div>
                    )}
                    {(blockResponse.blockType === 'INPUT_PROMPT' && blockResponse.inputType === 'AUDIO' && blockResponse.audio) && (
                      <div>
                        {`Answer: ${blockResponse.audio.transcript}`}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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
