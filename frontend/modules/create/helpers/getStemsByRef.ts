import each from 'lodash/each';
import { PositionedStem } from '../create.types';

const getStemsByRef = ({ tree }: { tree: PositionedStem }, stemsByRef: Record<string, PositionedStem> = {}) => {
  stemsByRef[tree.ref] = tree;
  each(tree.stems, (childStem) => getStemsByRef({ tree: childStem }, stemsByRef));
  return stemsByRef;
};

export default getStemsByRef;
