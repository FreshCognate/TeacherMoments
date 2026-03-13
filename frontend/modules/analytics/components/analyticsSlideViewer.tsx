import React from 'react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import classnames from 'classnames';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import Pagination from '~/uikit/pagination/components/pagination';

interface AnalyticsSlideViewerProps {
  activeSlide: any;
  activeBlocks: any[];
  allBlocks: any[];
  blockTrackingByRef: Record<string, any>;
  feedbackItems: string[];
  selectedBlockResponseRef: string | null;
  currentSlideIndex: number;
  totalSlides: number;
  onNavigateSlide: (direction: string) => void;
  onBlockClicked: (blockRef: string) => void;
}

const AnalyticsSlideViewer: React.FC<AnalyticsSlideViewerProps> = ({
  activeSlide,
  activeBlocks,
  allBlocks,
  blockTrackingByRef,
  feedbackItems,
  selectedBlockResponseRef,
  currentSlideIndex,
  totalSlides,
  onNavigateSlide,
  onBlockClicked
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
        const isPrompt = getBlockDisplayType(block) === 'PROMPT';

        return (
          <div
            key={block._id}
            className={classnames('mb-4 last:mb-0 p-4 bg-lm-2 rounded-md dark:bg-dm-2', {
              'cursor-pointer': isPrompt,
              'ring-1 ring-inset ring-primary-regular': selectedBlockResponseRef === block.ref
            })}
            onClick={isPrompt ? () => onBlockClicked(block.ref) : undefined}
          >
            <Block
              block={block}
              allBlocks={allBlocks}
              blockTracking={blockTracking}
              isResponseBlock={true}
              onUpdateBlockTracking={noop}
              navigateTo={noop}
            />
          </div>
        );
      })}
      {feedbackItems.length > 0 && (
        <div className="mt-4 p-4 bg-lm-2 dark:bg-dm-2 rounded-md">
          <div className="text-xs font-semibold text-black/40 dark:text-white/40 mb-2">Feedback</div>
          {map(feedbackItems, (item, index) => (
            <div key={index} className="text-sm text-black/60 dark:text-white/60 mb-2 last:mb-0">{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsSlideViewer;
