import React from 'react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import classnames from 'classnames';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';

interface AnalyticsSlideViewerProps {
  activeSlide: any;
  activeBlocks: any[];
  blockTrackingByRef: Record<string, any>;
  selectedBlockResponseRef: string | null;
}

const AnalyticsSlideViewer: React.FC<AnalyticsSlideViewerProps> = ({
  activeSlide,
  activeBlocks,
  blockTrackingByRef,
  selectedBlockResponseRef
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
          <div key={block._id} className={classnames('mb-4 last:mb-0 p-4 bg-lm-2 rounded-md dark:bg-dm-2', {
            'ring-1 ring-inset ring-primary-regular': selectedBlockResponseRef === block.ref
          })}>
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
