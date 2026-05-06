import { describe, it, expect, beforeEach } from 'vitest';
import getString from '../helpers/getString';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (data: any) => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('getString', () => {
  beforeEach(() => {
    seedApp({ language: 'en' });
  });

  it('returns string values as-is', () => {
    const model = { 'en-name': 'Hello' };
    expect(getString({ model, field: 'name' })).toBe('Hello');
  });

  it('converts a slate value to an HTML paragraph string', () => {
    const model = {
      'en-name': [
        { type: 'paragraph', children: [{ text: 'Hello' }] }
      ]
    };
    expect(getString({ model, field: 'name' })).toBe('<p><span>Hello</span></p>');
  });

  it('renders a slate value as a span when isTitle is true', () => {
    const model = {
      'en-name': [
        { type: 'paragraph', children: [{ text: 'Hello' }] }
      ]
    };
    expect(getString({ model, field: 'name', isTitle: true })).toBe(
      '<span class="block "><span>Hello</span></span>'
    );
  });

  it('returns undefined when the model is not provided', () => {
    expect(getString({ model: undefined as any, field: 'name' })).toBeUndefined();
  });

  it('reads the field for the current app language', () => {
    seedApp({ language: 'fr' });
    const model = { 'en-name': 'Hello', 'fr-name': 'Bonjour' };
    expect(getString({ model, field: 'name' })).toBe('Bonjour');
  });
});
