import { describe, it, expect } from 'vitest';
import map from 'lodash/map';
import getTree from '../helpers/getTree';
import { buildStem, buildSlide } from './overviewFixtures';

const defaultOptions = {
  scenarioId: 'scenario-1',
  activeSlideId: null,
  activeStemRef: null
};

describe('getTree', () => {
  it('returns null when there is no root stem', () => {
    expect(getTree({ ...defaultOptions, stems: [buildStem('B1')], slides: [] })).toBeNull();
  });

  it('builds the tree from the root stem with columns', () => {
    const stems = [buildStem('A', ['B1', 'B2'], true), buildStem('B1'), buildStem('B2')];
    const slides = [buildSlide('slide-a', 'A'), buildSlide('slide-b1', 'B1'), buildSlide('slide-b2', 'B2')];

    const builtTree = getTree({ ...defaultOptions, stems, slides });

    expect(builtTree?.columnsByRef).toEqual({ A: 0, B1: 1, B2: 1 });
    expect(builtTree?.tree.ref).toBe('A');
    expect(builtTree?.tree.childStemRefs).toEqual(['B1', 'B2']);
    expect(map(builtTree?.tree.stems, 'ref')).toEqual(['B1', 'B2']);
  });

  it('links each stem to its first real slide', () => {
    const stems = [buildStem('A', ['B1'], true), buildStem('B1')];
    const slides = [buildSlide('slide-a', 'A'), buildSlide('slide-b1', 'B1')];

    const builtTree = getTree({ ...defaultOptions, stems, slides });

    expect(builtTree?.tree.to).toBe('/scenarios/scenario-1/create?slide=slide-a');
    expect(builtTree?.tree.stems?.[0].to).toBe('/scenarios/scenario-1/create?slide=slide-b1');
  });

  it('nests a shared stem only under its owner but keeps it as a child ref of every parent', () => {
    const stems = [
      buildStem('A', ['B1', 'B2'], true),
      buildStem('B1', ['SHARED']),
      buildStem('B2', ['SHARED']),
      buildStem('SHARED')
    ];
    const slides = map(stems, (stem) => buildSlide(`slide-${stem.ref}`, stem.ref));

    const builtTree = getTree({ ...defaultOptions, stems, slides });
    const [firstStem, secondStem] = builtTree?.tree.stems || [];

    expect(map(firstStem.stems, 'ref')).toEqual(['SHARED']);
    expect(secondStem.stems).toEqual([]);
    expect(secondStem.childStemRefs).toEqual(['SHARED']);
  });

  it('ignores branching options to missing stems', () => {
    const stems = [buildStem('A', ['B1', 'MISSING'], true), buildStem('B1')];
    const slides = [buildSlide('slide-a', 'A'), buildSlide('slide-b1', 'B1')];

    const builtTree = getTree({ ...defaultOptions, stems, slides });

    expect(builtTree?.tree.childStemRefs).toEqual(['B1']);
  });
});
