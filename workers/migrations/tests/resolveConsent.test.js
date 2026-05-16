import { describe, it, expect, vi, beforeEach } from 'vitest';
import resolveConsent from '../helpers/resolveConsent.js';

const buildPool = (responses) => {
  const query = vi.fn();
  for (const r of responses) query.mockResolvedValueOnce({ rows: r });
  return { query };
};

describe('resolveConsent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns null when no scenario_consent link exists', async () => {
    const pool = buildPool([[]]);

    const result = await resolveConsent({ pgScenarioId: 'sc1', pool });

    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query.mock.calls[0][0]).toContain('FROM scenario_consent');
  });

  it('returns null when the consent record itself is missing', async () => {
    const pool = buildPool([
      [{ consent_id: 'c1' }],
      []
    ]);

    const result = await resolveConsent({ pgScenarioId: 'sc1', pool });
    expect(result).toBeNull();
  });

  it('returns null when prose is empty/whitespace', async () => {
    const pool = buildPool([
      [{ consent_id: 'c1' }],
      [{ prose: '   ' }]
    ]);

    const result = await resolveConsent({ pgScenarioId: 'sc1', pool });
    expect(result).toBeNull();
  });

  it('returns slate + consentId when prose is populated', async () => {
    const pool = buildPool([
      [{ consent_id: 'c1' }],
      [{ prose: '<p>I consent</p>' }]
    ]);

    const result = await resolveConsent({ pgScenarioId: 'sc1', pool });
    expect(result.consentId).toBe('c1');
    expect(result.slate).toEqual([
      { type: 'paragraph', children: [{ text: 'I consent' }] }
    ]);
  });
});
