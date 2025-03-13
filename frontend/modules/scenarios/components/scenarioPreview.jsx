import React from 'react';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';

const ScenarioPreview = ({
  activeSlide,
  activeBlocks,
}) => {
  return (
    <div className="w-full pt-4 pb-8 px-8 max-w-screen-sm mx-auto">
      <SlidePlayerContainer activeSlide={activeSlide} activeBlocks={activeBlocks} />
    </div>
  );
};

export default ScenarioPreview;