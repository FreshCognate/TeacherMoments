import { describe, it, expect } from 'vitest';
import map from 'lodash/map';
import getOverviewSlides from '../helpers/getOverviewSlides';
import { buildStem, buildSlide } from './overviewFixtures';

const slides = [buildSlide('slide-1', 'A'), buildSlide('slide-2', 'B1'), buildSlide('slide-3', 'A')];

const defaultOptions = {
  slides,
  scenarioId: 'scenario-1',
  activeSlideId: null,
  activeStemRef: null,
  hasChildStems: true
};

describe('getOverviewSlides', () => {
  it('returns only the slides belonging to the stem with links', () => {
    const stemSlides = getOverviewSlides({ ...defaultOptions, stem: buildStem('B1') });

    expect(map(stemSlides, '_id')).toEqual(['slide-2']);
    expect(stemSlides[0].to).toBe('/scenarios/scenario-1/create?slide=slide-2');
    expect(stemSlides[0].isSelected).toBe(false);
  });

  it('marks the active slide as selected', () => {
    const stemSlides = getOverviewSlides({ ...defaultOptions, stem: buildStem('B1'), activeSlideId: 'slide-2' });

    expect(stemSlides[0].isSelected).toBe(true);
  });

  it('adds a consent slide first for the root stem', () => {
    const stemSlides = getOverviewSlides({
      ...defaultOptions,
      stem: buildStem('A', [], true),
      activeSlideId: 'CONSENT'
    });

    expect(map(stemSlides, '_id')).toEqual(['CONSENT_SLIDE', 'slide-1', 'slide-3']);
    expect(stemSlides[0].to).toBe('/scenarios/scenario-1/create?slide=CONSENT');
    expect(stemSlides[0].isSelected).toBe(true);
  });

  it('adds a summary slide last when the stem has no child stems', () => {
    const stemSlides = getOverviewSlides({ ...defaultOptions, stem: buildStem('B1'), hasChildStems: false });

    expect(map(stemSlides, '_id')).toEqual(['slide-2', 'SUMMARY_SLIDE']);
    expect(stemSlides[1].sortOrder).toBe(1);
    expect(stemSlides[1].isSelected).toBe(false);
  });

  it('selects the summary slide only for the active stem', () => {
    const activeOptions = {
      ...defaultOptions,
      hasChildStems: false,
      activeSlideId: 'SUMMARY',
      activeStemRef: 'B1'
    };

    const activeStemSlides = getOverviewSlides({ ...activeOptions, stem: buildStem('B1') });
    const otherStemSlides = getOverviewSlides({ ...activeOptions, stem: buildStem('B2') });

    expect(activeStemSlides[1].isSelected).toBe(true);
    expect(otherStemSlides[0].isSelected).toBe(false);
  });
});
