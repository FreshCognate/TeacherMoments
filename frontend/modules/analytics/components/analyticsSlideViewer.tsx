import React from 'react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';

interface AnalyticsSlideViewerProps {
  activeSlide: any;
  activeBlocks: any[];
  blockTrackingByRef: Record<string, any>;
}

const AnalyticsSlideViewer: React.FC<AnalyticsSlideViewerProps> = ({
  activeSlide,
  activeBlocks,
  blockTrackingByRef
}) => {
  return (
    <div>
      <div className="text-sm font-medium text-black/60 dark:text-white/60 mb-4">
        {activeSlide.name}
      </div>
      {map(activeBlocks, (block) => {
        const Block = getBlockComponent({ blockType: block.blockType });
        if (!Block) return null;

        const blockTracking = blockTrackingByRef[block.ref] || {};

        return (
          <div key={block._id} className="mb-4 last:mb-0 p-4 bg-lm-2 rounded-md dark:bg-dm-2">
            <Block
              block={block}
              blockTracking={blockTracking}
              isResponseBlock={true}
              onUpdateBlockTracking={noop}
              navigateTo={noop}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsSlideViewer;
