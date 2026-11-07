import each from 'lodash/each';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { PositionedStem } from '../create.types';
import getTree from './getTree';
import getStemsByRef from './getStemsByRef';
import getOffsetsX from './getOffsetsX';
import parseTree from './parseTree';
import setStemLabels from './setStemLabels';

type Options = {
  stems: Stem[];
  slides: Slide[];
  scenarioId: string;
};

export default ({ stems, slides, scenarioId }: Options): Record<string, string> => {
  const builtTree = getTree({
    stems,
    slides,
    scenarioId,
    activeSlideId: null,
    activeStemRef: null
  });

  if (!builtTree) return {};

  const stemsByRef = getStemsByRef({ tree: builtTree.tree as PositionedStem });

  parseTree({
    tree: builtTree.tree as PositionedStem,
    offsetsX: getOffsetsX({ stemsByRef })
  });
  setStemLabels({ stemsByRef, columnsByRef: builtTree.columnsByRef });

  const stemLabelsByRef: Record<string, string> = {};
  each(stemsByRef, (stem) => {
    stemLabelsByRef[stem.ref] = stem.label;
  });
  return stemLabelsByRef;
};
