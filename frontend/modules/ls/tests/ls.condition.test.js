import { describe, it, expect, beforeEach } from 'vitest';
import '../helpers/ls.condition';
import Conditions from '~/core/forms/forms.conditions';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (data) => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

describe('ls condition', () => {
  beforeEach(() => {
    seedApp({ language: 'en' });
  });

  it('registers itself on the Conditions registry under the "ls" key', () => {
    expect(typeof Conditions.ls).toBe('function');
  });

  it('returns hasCondition: false when the language matches the app language', () => {
    expect(Conditions.ls({ condition: { language: 'en' } })).toEqual({
      hasCondition: false,
      condition: null
    });
  });

  it('returns hasCondition: true with a "Not the correct language" message when the language differs', () => {
    expect(Conditions.ls({ condition: { language: 'fr' } })).toEqual({
      hasCondition: true,
      condition: 'Not the correct language'
    });
  });
});
