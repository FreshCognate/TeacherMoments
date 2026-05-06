import { describe, it, expect, beforeEach } from 'vitest';
import getContent from '../helpers/getContent';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (data) => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getContent', () => {
  beforeEach(() => {
    seedApp({ language: 'en' });
  });

  it('returns the value at the language-prefixed field', () => {
    const model = { 'en-name': 'Hello' };
    expect(getContent({ model, field: 'name' })).toBe('Hello');
  });

  it('returns undefined when the field is missing', () => {
    expect(getContent({ model: {}, field: 'name' })).toBeUndefined();
  });

  it('returns undefined when the model is not provided', () => {
    expect(getContent({ model: undefined, field: 'name' })).toBeUndefined();
  });

  it('reads the field for the current app language', () => {
    seedApp({ language: 'fr' });
    const model = { 'en-name': 'Hello', 'fr-name': 'Bonjour' };
    expect(getContent({ model, field: 'name' })).toBe('Bonjour');
  });
});
