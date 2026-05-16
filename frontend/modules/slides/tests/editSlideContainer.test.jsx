import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

let capturedProps = null;
vi.mock('../components/editSlide', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="edit-slide-stub" />;
  }
}));

vi.mock('../schemas/editSlideSchema', () => ({
  default: { name: { type: 'Text', label: 'Name' } }
}));

import EditSlideContainer from '../containers/editSlideContainer';

describe('EditSlideContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    getCacheMock.mockReset();
  });

  it('passes the schema and slide data through to EditSlide', () => {
    const slide = { data: { _id: 's1', name: 'Slide One' }, mutate: vi.fn() };
    render(<EditSlideContainer slide={slide} />);
    expect(capturedProps.schema).toEqual({ name: { type: 'Text', label: 'Name' } });
    expect(capturedProps.slide).toEqual({ _id: 's1', name: 'Slide One' });
  });

  it('optimistically updates the slides cache and triggers a put when the form changes', () => {
    const slidesCache = { setStatus: vi.fn(), set: vi.fn(), fetch: vi.fn() };
    getCacheMock.mockImplementation((key) => {
      if (key === 'slides') return slidesCache;
      return { fetch: vi.fn() };
    });

    const slide = {
      data: { _id: 's1', name: 'Old' },
      mutate: vi.fn()
    };
    render(<EditSlideContainer slide={slide} />);

    capturedProps.onSlideFormUpdate({ update: { name: 'New' } });

    expect(slidesCache.setStatus).toHaveBeenCalledWith('syncing');
    expect(slidesCache.set).toHaveBeenCalledWith(
      { name: 'New' },
      { setType: 'itemExtend', setFind: { _id: 's1' } }
    );
    expect(slide.mutate).toHaveBeenCalledWith({ name: 'New' }, { method: 'put' }, expect.any(Function));
  });

  it('refetches the slides and scenario caches once the mutation succeeds', () => {
    const slidesCache = { setStatus: vi.fn(), set: vi.fn(), fetch: vi.fn() };
    const scenarioCache = { fetch: vi.fn() };
    getCacheMock.mockImplementation((key) => {
      if (key === 'slides') return slidesCache;
      if (key === 'scenario') return scenarioCache;
      return null;
    });

    const slide = {
      data: { _id: 's1', name: 'Old' },
      mutate: vi.fn()
    };
    render(<EditSlideContainer slide={slide} />);

    capturedProps.onSlideFormUpdate({ update: { name: 'New' } });

    const callback = slide.mutate.mock.calls[0][2];
    callback('MUTATED');

    expect(slidesCache.fetch).toHaveBeenCalled();
    expect(scenarioCache.fetch).toHaveBeenCalled();
  });

  it('does not refetch when the mutation status is not MUTATED', () => {
    const slidesCache = { setStatus: vi.fn(), set: vi.fn(), fetch: vi.fn() };
    const scenarioCache = { fetch: vi.fn() };
    getCacheMock.mockImplementation((key) => {
      if (key === 'slides') return slidesCache;
      if (key === 'scenario') return scenarioCache;
      return null;
    });

    const slide = {
      data: { _id: 's1', name: 'Old' },
      mutate: vi.fn()
    };
    render(<EditSlideContainer slide={slide} />);

    capturedProps.onSlideFormUpdate({ update: { name: 'New' } });

    const callback = slide.mutate.mock.calls[0][2];
    callback('PENDING');

    slidesCache.fetch.mockClear();
    expect(slidesCache.fetch).not.toHaveBeenCalled();
    expect(scenarioCache.fetch).not.toHaveBeenCalled();
  });
});
