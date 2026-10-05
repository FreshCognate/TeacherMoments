import React from 'react';
import map from 'lodash/map';
import { PositionedStem } from '../create.types';
import { Link } from 'react-router';

const CreateOverviewStem = ({
  stem,
  onStemClicked
}: {
  stem: PositionedStem;
  onStemClicked: ({ stemRef: string }) => void;
}) => {
  return (
    <>
      <div
        className="absolute flex p-2 border-2 border-lm-2 dark:border-dm-2 rounded-full gap-x-2 items-center"
        style={{ left: stem.x, top: stem.y }}
      >
        <div className="absolute -top-6 text-sm whitespace-nowrap">
          <Link to={stem.to} onClick={() => onStemClicked({ stemRef: stem.ref })}>
            {stem.name}
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          {map(stem.slides, (slide) => {
            return (
              <Link to={slide.to}
                key={slide._id}
                className="flex bg-lm-2 dark:bg-dm-2 w-8 h-8 rounded-full items-center justify-center"
                onClick={() => onStemClicked({ stemRef: stem.ref })}
              >
                <div>
                  {slide.slideType === 'CONSENT' && 'C'}
                  {slide.slideType === 'SUMMARY' && 'S'}
                  {slide.slideType === 'STEP' && `${slide.sortOrder + 1}`}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="absolute -bottom-6 text-sm whitespace-nowrap opacity-40">
          {stem.label}
        </div>
      </div>
      {map(stem.stems, (stem) => {
        return (
          <CreateOverviewStem key={stem._id} stem={stem} onStemClicked={onStemClicked} />
        )
      })}
    </>
  );
};

export default CreateOverviewStem;