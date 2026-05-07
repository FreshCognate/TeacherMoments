import { describe, it, expect, vi } from 'vitest';
import getScenarioByPublishLink from '../services/getScenarioByPublishLink.js';

describe('getScenarioByPublishLink', () => {
  it('queries Published_Scenario by publishLink and isDeleted=false', async () => {
    const Published_Scenario = {
      findOne: vi.fn().mockResolvedValue({ _id: 's1', isPublished: true })
    };

    await getScenarioByPublishLink(
      { publishLink: 'happy-fox' },
      {},
      { models: { Published_Scenario } }
    );

    expect(Published_Scenario.findOne).toHaveBeenCalledWith({ publishLink: 'happy-fox', isDeleted: false });
  });

  it('throws 404 with shouldRedirectToScenarios when no scenario matches', async () => {
    const Published_Scenario = { findOne: vi.fn().mockResolvedValue(null) };

    await expect(getScenarioByPublishLink(
      { publishLink: 'missing' },
      {},
      { models: { Published_Scenario } }
    )).rejects.toMatchObject({ statusCode: 404, shouldRedirectToScenarios: true });
  });

  it('throws 404 when the scenario exists but is not published', async () => {
    const Published_Scenario = {
      findOne: vi.fn().mockResolvedValue({ _id: 's1', isPublished: false })
    };

    await expect(getScenarioByPublishLink(
      { publishLink: 'happy-fox' },
      {},
      { models: { Published_Scenario } }
    )).rejects.toMatchObject({ statusCode: 404, shouldRedirectToScenarios: true });
  });

  it('returns the scenario when found and published', async () => {
    const scenario = { _id: 's1', isPublished: true };
    const Published_Scenario = { findOne: vi.fn().mockResolvedValue(scenario) };

    const result = await getScenarioByPublishLink(
      { publishLink: 'happy-fox' },
      {},
      { models: { Published_Scenario } }
    );

    expect(result).toBe(scenario);
  });
});
