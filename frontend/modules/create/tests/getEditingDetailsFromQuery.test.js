import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import getEditingDetailsFromQuery from '../helpers/getEditingDetailsFromQuery';

const setSearch = (search) => {
  window.history.replaceState({}, '', `/${search}`);
};

describe('getEditingDetailsFromQuery', () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  it('returns null values when there are no query parameters', () => {
    setSearch('');
    expect(getEditingDetailsFromQuery()).toEqual({
      isEditing: null,
      layer: NaN,
      slide: null
    });
  });

  it('returns the isEditing query parameter as a string', () => {
    setSearch('?isEditing=true');
    expect(getEditingDetailsFromQuery().isEditing).toBe('true');
  });

  it('returns "root" when the layer is "root"', () => {
    setSearch('?layer=root');
    expect(getEditingDetailsFromQuery().layer).toBe('root');
  });

  it('returns the layer parsed as an integer when it is a numeric string', () => {
    setSearch('?layer=2');
    expect(getEditingDetailsFromQuery().layer).toBe(2);
  });

  it('returns the slide query parameter as a string', () => {
    setSearch('?slide=slide-1');
    expect(getEditingDetailsFromQuery().slide).toBe('slide-1');
  });

  it('returns each value when multiple parameters are present', () => {
    setSearch('?isEditing=true&layer=3&slide=slide-1');
    expect(getEditingDetailsFromQuery()).toEqual({
      isEditing: 'true',
      layer: 3,
      slide: 'slide-1'
    });
  });
});
