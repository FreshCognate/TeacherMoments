import React from 'react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import classnames from 'classnames';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';
import Pagination from '~/uikit/pagination/components/pagination';

interface AnalyticsSlideViewerProps {
  activeSlide: any;
  activeBlocks: any[];
  blockTrackingByRef: Record<string, any>;
  selectedBlockResponseRef: string | null;
  currentSlideIndex: number;
  totalSlides: number;
  onNavigateSlide: (direction: string) => void;
}

const AnalyticsSlideViewer: React.FC<AnalyticsSlideViewerProps> = ({
  activeSlide,
  activeBlocks,
  blockTrackingByRef,
  selectedBlockResponseRef,
  currentSlideIndex,
  totalSlides,
  onNavigateSlide
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 h-8">
        <div className="text-sm font-medium text-black/60 dark:text-white/60">
          {activeSlide.name}
        </div>
        <Pagination
          currentPage={currentSlideIndex + 1}
          totalPages={totalSlides}
          onClick={onNavigateSlide}
        />
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
