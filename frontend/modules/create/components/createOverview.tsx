import React from 'react';
import map from 'lodash/map';
import { PositionedStem, Edge } from '../create.types';
import CreateOverviewStem from './createOverviewStem';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';


type Props = {
  tree: PositionedStem;
  maxWidth: number;
  maxHeight: number;
  edges: Edge[];
  branchToStem: string | null;
  onStemClicked: ({ stemRef }: { stemRef: string }) => void;
  onBranchToStemClicked: ({ stemRef }: { stemRef: string | null }) => void
};

const CreateOverview = ({
  tree,
  maxWidth,
  maxHeight,
  edges,
  branchToStem,
  onStemClicked,
  onBranchToStemClicked
}: Props) => {
  return (
    <div className="relative">
      {(branchToStem) && (
        <div className={classnames("sticky flex items-center justify-between top-10 z-20", {
          "invisible": !branchToStem,
          "visible": branchToStem
        })}>
          <div className="absolute flex items-center justify-between bg-blue-500 py-2 px-4 top-0 w-full">
            <div className="text-sm">
              Select an existing stem to branch to
            </div>
            <FlatButton text="Cancel" onClick={() => onBranchToStemClicked({ stemRef: null })} />
          </div>
        </div>
      )}
      <div className="relative p-16">
        <div
          className="relative"
          style={{ width: maxWidth, height: maxHeight }}
        >
          <svg
            style={{ position: "absolute", top: 0, left: 0 }}
            width={maxWidth}
            height={maxHeight}
          >
            {map(edges, (edge, index) => {
              const getPath = ({ from, to }: Edge) => {
                const dx = (to.x - from.x) / 2;
                return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
              }
              return (
                <path
                  key={index}
                  d={getPath(edge)}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
          <CreateOverviewStem stem={tree} onStemClicked={onStemClicked} onBranchToStemClicked={onBranchToStemClicked} />
        </div>
      </div>
    </div>
  );
};

export default CreateOverview;