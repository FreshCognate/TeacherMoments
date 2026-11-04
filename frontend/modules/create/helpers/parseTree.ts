import each from 'lodash/each';
import { PositionedStem, OVERVIEW_GAP_Y } from '../create.types';
import getStemWidth from './getStemWidth';

type ParsedTree = {
  tree: PositionedStem;
  maxWidth: number;
  maxHeight: number;
};

export default ({ tree, offsetsX }: { tree: PositionedStem, offsetsX: Record<string, number> }): ParsedTree => {
  let nextY = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  const positionStem = (stem: PositionedStem) => {
    const children = stem.stems || [];

    each(children, positionStem);

    stem.x = offsetsX[stem.ref];

    if (children.length === 0) {
      stem.y = nextY;
      nextY += OVERVIEW_GAP_Y;
    } else {
      stem.y = (children[0].y + children[children.length - 1].y) / 2;
    }

    maxWidth = Math.max(maxWidth, stem.x + getStemWidth({ stem }));
    maxHeight = Math.max(maxHeight, stem.y + OVERVIEW_GAP_Y);
  };

  positionStem(tree);

  return { tree, maxWidth, maxHeight };
};
