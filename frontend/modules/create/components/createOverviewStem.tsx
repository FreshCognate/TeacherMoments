import React from 'react';
import map from 'lodash/map';
import { PositionedStem } from '../create.types';
import { Link } from 'react-router';
import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';
import FlatButton from '~/uikit/buttons/components/flatButton';

const CreateOverviewStem = ({
  stem,
  onStemClicked,
  onBranchToStemClicked
}: {
  stem: PositionedStem;
  onStemClicked: ({ stemRef }: { stemRef: string }) => void;
  onBranchToStemClicked: ({ stemRef }: { stemRef: string | null }) => void;
}) => {
  return (
    <>
      <div
        className="absolute flex p-2 border-2 border-lm-3 dark:border-dm-2 bg-lm-1 dark:bg-dm-1 rounded-full gap-x-2 items-center transition-all group"
        style={{ left: stem.x, top: stem.y }}
      >
        {(stem.canBeBranchedTo) && (

          <div className="absolute -left-6 border-2 border-lm-3 dark:border-dm-2 bg-lm-1 rounded-full p-1 dark:bg-dm-1">
            <FlatButton icon="linkBranch" onClick={onBranchToStemClicked} />
          </div>
        )}
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
                className={classnames("flex bg-lm-2 dark:bg-dm-2 w-8 h-8 rounded-full items-center justify-center", {
                  "outline outline-2 outline-blue-500": slide.isSelected
                })}
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
        <div className="hidden group-hover:block">
          <FlatButton icon="branchTo" onClick={() => onBranchToStemClicked({ stemRef: stem.ref })} />
        </div>
      </div>
      {map(stem.stems, (stem) => {
        return (
          <CreateOverviewStem key={stem._id} stem={stem} onStemClicked={onStemClicked} onBranchToStemClicked={onBranchToStemClicked} />
        )
      })}
    </>
  );
};

export default CreateOverviewStem;