import React from 'react';
import SlidePlayerContainer from '~/modules/slides/containers/slidePlayerContainer';

const ScenarioPreview = ({
  activeSlide,
  activeBlocks,
}) => {
  return (
    <SlidePlayerContainer activeSlide={activeSlide} activeBlocks={activeBlocks} isPreview />
  );
};

export default ScenarioPreview;