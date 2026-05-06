import { describe, it, expect, beforeEach } from 'vitest';
import setContent from '../helpers/setContent';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (data) => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('setContent', () => {
  beforeEach(() => {
    seedApp({ language: 'en' });
  });

  it('sets the value at the language-prefixed field and returns the model', () => {
    const model = {};
    const result = setContent({ model, field: 'name', content: 'Hello' });
    expect(model).toEqual({ 'en-name': 'Hello' });
    expect(result).toBe(model);
  });

  it('overwrites an existing value', () => {
    const model = { 'en-name': 'Hello' };
    setContent({ model, field: 'name', content: 'Goodbye' });
    expect(model['en-name']).toBe('Goodbye');
  });

  it('returns undefined when the model is not provided', () => {
    expect(setContent({ model: undefined, field: 'name', content: 'Hello' })).toBeUndefined();
  });

  it('writes the field for the current app language', () => {
    seedApp({ language: 'fr' });
    const model = {};
    setContent({ model, field: 'name', content: 'Bonjour' });
    expect(model).toEqual({ 'fr-name': 'Bonjour' });
  });
});
