import { describe, it, expect, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getScenarioByPublishLink from '../services/getScenarioByPublishLink.js';

const db = setupMongo();

describe('getScenarioByPublishLink (in-memory mongo)', () => {
  beforeEach(() => {});

  it('returns the published scenario matching the publishLink', async () => {
    const scenario = await db.models.Published_Scenario.create({
      name: 'S',
      publishLink: 'happy-fox',
      isPublished: true
    });

    const result = await getScenarioByPublishLink(
      { publishLink: 'happy-fox' }, {}, { models: db.models }
    );

    expect(String(result._id)).toBe(String(scenario._id));
  });

  it('throws 404 with shouldRedirectToScenarios when no scenario matches', async () => {
    await expect(
      getScenarioByPublishLink({ publishLink: 'missing' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, shouldRedirectToScenarios: true });
  });

  it('throws 404 when the scenario exists but is not published', async () => {
    await db.models.Published_Scenario.create({
      name: 'S',
      publishLink: 'happy-fox',
      isPublished: false
    });

    await expect(
      getScenarioByPublishLink({ publishLink: 'happy-fox' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 404, shouldRedirectToScenarios: true });
  });
});
