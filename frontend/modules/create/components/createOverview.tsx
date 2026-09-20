import React from 'react';
import map from 'lodash/map';
import { PositionedStem, Edge } from '../create.types';
import CreateOverviewStem from './createOverviewStem';



type Props = {
  tree: PositionedStem;
  maxWidth: number;
  maxHeight: number;
  edges: Edge[];
};

const CreateOverview = ({
  tree,
  maxWidth,
  maxHeight,
  edges,
}: Props) => {
  return (
    <div className="">
      <div className="relative">
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
                stroke="#ff5567"
                strokeWidth={2}
              />
            );
          })}
        </svg>
        <CreateOverviewStem stem={tree} />
      </div>
    </div>
  );
};

export default CreateOverview;