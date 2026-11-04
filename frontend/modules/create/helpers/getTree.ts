import find from 'lodash/find';
import map from 'lodash/map';
import each from 'lodash/each';
import keyBy from 'lodash/keyBy';
import compact from 'lodash/compact';
import { Stem } from '~/modules/stems/stems.types';
import { Slide } from '~/modules/slides/slides.types';
import { OverviewStem } from '../create.types';
import getStemHierarchy from './getStemHierarchy';
import getOverviewSlides from './getOverviewSlides';

type Options = {
  stems: Stem[];
  slides: Slide[];
  scenarioId: string;
  activeSlideId: string | null;
  activeStemRef: string | null;
};

type Tree = {
  tree: OverviewStem;
  columnsByRef: Record<string, number>;
};

export default ({ stems, slides, scenarioId, activeSlideId, activeStemRef }: Options): Tree | null => {
  const rootStem = find(stems, { isRoot: true });

  if (!rootStem) return null;

  const stemsByRef = keyBy(stems, 'ref');
  const builtStemRefs = new Set<string>();
  const { depthsByRef: columnsByRef, ownerRefsByRef } = getStemHierarchy({ stems, rootStem });

  const buildStem = (stem: Stem): OverviewStem => {
    builtStemRefs.add(stem.ref);
    const childStems = compact(map(stem.branchingOptions, (branchingOption) => stemsByRef[branchingOption.stemRef]));

    const stemSlides = getOverviewSlides({
      stem,
      slides,
      scenarioId,
      activeSlideId,
      activeStemRef,
      hasChildStems: childStems.length > 0
    });

    const firstSlide = find(slides, { stemRef: stem.ref });

    const builtChildStems: OverviewStem[] = [];

    each(childStems, (childStem) => {
      if (builtStemRefs.has(childStem.ref)) return;
      if (ownerRefsByRef[childStem.ref] !== stem.ref) return;
      builtChildStems.push(buildStem(childStem));
    });

    return {
      _id: stem._id,
      ref: stem.ref,
      name: stem.name,
      to: `/scenarios/${scenarioId}/create?slide=${firstSlide?._id}`,
      label: '',
      slides: stemSlides,
      childStemRefs: map(childStems, 'ref'),
      stems: builtChildStems,
      canBeBranchedTo: false
    };
  };

  return { tree: buildStem(rootStem), columnsByRef };
};
