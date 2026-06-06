import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    put: vi.fn().mockResolvedValue({})
  }
}));

import axios from 'axios';
import sortSlides from '../helpers/sortSlides';
import { createCache, resetCache, getCache } from '~/core/cache/helpers/cacheManager';

const slides = [
  { _id: 'slide-1', sortOrder: 0 },
  { _id: 'slide-2', sortOrder: 1 },
  { _id: 'slide-3', sortOrder: 2 }
];

const seedSlides = (data) => {
  resetCache('slides');
  createCache({
    key: 'slides',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('sortSlides', () => {
  beforeEach(() => {
    axios.put.mockClear();
    seedSlides(slides);
  });

  it('does nothing when active is missing', () => {
    sortSlides({ active: null, over: { data: { current: { sortOrder: 1 } } } });
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('does nothing when over is missing', () => {
    sortSlides({ active: { id: 'slide-1', data: { current: { sortOrder: 0 } } }, over: null });
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('does nothing when source and destination are the same', () => {
    sortSlides({
      active: { id: 'slide-2', data: { current: { sortOrder: 1 } } },
      over: { data: { current: { sortOrder: 1 } } }
    });
    expect(axios.put).not.toHaveBeenCalled();
  });

  it('moves a slide forward and resets sortOrder values', () => {
    sortSlides({
      active: { id: 'slide-1', data: { current: { sortOrder: 0 } } },
      over: { data: { current: { sortOrder: 2 } } }
    });

    const reordered = getCache('slides').data;
    expect(reordered.map((s) => s._id)).toEqual(['slide-2', 'slide-1', 'slide-3']);
    expect(reordered.map((s) => s.sortOrder)).toEqual([0, 1, 2]);
  });

  it('moves a slide backward without offsetting the destination index', () => {
    sortSlides({
      active: { id: 'slide-3', data: { current: { sortOrder: 2 } } },
      over: { data: { current: { sortOrder: 0 } } }
    });

    const reordered = getCache('slides').data;
    expect(reordered.map((s) => s._id)).toEqual(['slide-3', 'slide-1', 'slide-2']);
  });

  it('only reorders slides within the dragged slide\'s stem, leaving other stems untouched', () => {
    seedSlides([
      { _id: 'a-1', stemRef: 'stem-a', sortOrder: 0 },
      { _id: 'a-2', stemRef: 'stem-a', sortOrder: 1 },
      { _id: 'b-1', stemRef: 'stem-b', sortOrder: 0 },
      { _id: 'b-2', stemRef: 'stem-b', sortOrder: 1 },
      { _id: 'b-3', stemRef: 'stem-b', sortOrder: 2 }
    ]);

    sortSlides({
      active: { id: 'b-1', data: { current: { sortOrder: 0 } } },
      over: { data: { current: { sortOrder: 2 } } }
    });

    const reordered = getCache('slides').data;

    const stemA = reordered.filter((s) => s.stemRef === 'stem-a');
    expect(stemA.map((s) => s._id)).toEqual(['a-1', 'a-2']);
    expect(stemA.map((s) => s.sortOrder)).toEqual([0, 1]);

    const stemB = reordered.filter((s) => s.stemRef === 'stem-b');
    expect(stemB.map((s) => s._id)).toEqual(['b-2', 'b-1', 'b-3']);
    expect(stemB.map((s) => s.sortOrder)).toEqual([0, 1, 2]);
  });

  it('PUTs the source and destination indices to the slide endpoint using the active id', () => {
    sortSlides({
      active: { id: 'slide-1', data: { current: { sortOrder: 0 } } },
      over: { data: { current: { sortOrder: 2 } } }
    });

    expect(axios.put).toHaveBeenCalledWith('/api/slides/slide-1', {
      sourceIndex: 0,
      destinationIndex: 1
    });
  });
});
