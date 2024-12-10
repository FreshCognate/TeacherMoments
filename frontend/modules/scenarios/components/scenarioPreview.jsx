import React from 'react';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';

const ScenarioPreview = ({
  activeSlide,
  activeBlocks,
}) => {
  return (
    <div className="w-full max-w-screen-sm mt-2">
      <div className="text-xs border border-b-0 border-lm-2 dark:border-dm-2 bg-lm-1 dark:bg-dm-1 rounded-t inline ml-1 py-0.5 px-1">
        Slide: {activeSlide?.name}
      </div>
      <SlidePlayerContainer activeSlide={activeSlide} activeBlocks={activeBlocks} />
    </div>
  );
};

export default ScenarioPreview;