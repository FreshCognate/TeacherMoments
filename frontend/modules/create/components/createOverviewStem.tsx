import React from 'react';
import map from 'lodash/map';
import { PositionedStem } from '../create.types';

const CreateOverviewStem = ({
  stem
}: {
  stem: PositionedStem
}) => {
  return (
    <>
      <div
        className="absolute flex p-2 border-2 border-lm-2 dark:border-dm-2 rounded-full gap-x-2 items-center"
        style={{ left: stem.x, top: stem.y }}
      >
        <div className="absolute -top-6 text-sm">
          {stem.name}
        </div>
        <div className="flex items-center gap-x-3">
          {map(stem.slides, (slide) => {
            return (
              <div
                key={slide._id}
                className="flex bg-lm-2 dark:bg-dm-2 w-8 h-8 rounded-full items-center justify-center"
              >
                <div>
                  {`${slide.sortOrder + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {map(stem.stems, (stem) => {
        return (
          <CreateOverviewStem key={stem._id} stem={stem} />
        )
      })}
    </>
  );
};

export default CreateOverviewStem;