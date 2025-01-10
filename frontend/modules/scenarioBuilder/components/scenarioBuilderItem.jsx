import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import Title from '~/uikit/content/components/title';

const ScenarioBuilderItem = ({
  slide
}) => {
  console.log(slide);
  return (
    <div className="border border-lm-2 dark:border-dm-2 bg-lm-0 dark:bg-dm-1 p-2 rounded-lg">
      {slide.isRoot && (
        <Badge text="Root" />
      )}
      <Title title={slide.name} />
    </div>
  );
};

export default ScenarioBuilderItem;