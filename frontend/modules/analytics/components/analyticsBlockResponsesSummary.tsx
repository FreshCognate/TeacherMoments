import React from 'react';
import Loading from '~/uikit/loaders/components/loading';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';
import { BlockColumn, UserResponse } from '../analytics.types';
import getBlockLabel from '../helpers/getBlockLabel';

interface AnalyticsBlockResponsesSummaryProps {
  blockColumn: BlockColumn;
  block: any;
  responses: UserResponse[];
  summary: string | null;
  isLoading: boolean;
}

const noop = () => {};

const AnalyticsBlockResponsesSummary: React.FC<AnalyticsBlockResponsesSummaryProps> = ({
  blockColumn,
  block,
  responses,
  summary,
  isLoading
}) => {
  const Block = block ? getBlockComponent({ blockType: block.blockType }) : null;

  return (
    <div className="p-4">
      <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-4">
        Block label: {getBlockLabel(blockColumn)}
      </p>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-2">Prompt</p>
            {Block && block && (
              <div className="p-4 bg-lm-2 rounded-md dark:bg-dm-2">
                <Block
                  block={block}
                  blockTracking={{}}
                  isResponseBlock={true}
                  onUpdateBlockTracking={noop}
                  navigateTo={noop}
                />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-black/80 dark:text-white/80 mb-2">Summary</p>
            {summary && (
              <p className="text-sm text-black/60 dark:text-white/60">{summary}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsBlockResponsesSummary;
