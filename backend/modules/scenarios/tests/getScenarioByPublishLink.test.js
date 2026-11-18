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

  it('throws 404 without a redirect when no scenario matches', async () => {
    const error = await getScenarioByPublishLink(
      { publishLink: 'missing' }, {}, { models: db.models }
    ).catch((caught) => caught);

    expect(error).toMatchObject({ statusCode: 404, message: 'This scenario does not exist' });
    expect(error).not.toHaveProperty('shouldRedirectToScenarios');
  });

  it('throws 404 without a redirect when the scenario exists but is not published', async () => {
    await db.models.Published_Scenario.create({
      name: 'S',
      publishLink: 'happy-fox',
      isPublished: false
    });

    const error = await getScenarioByPublishLink(
      { publishLink: 'happy-fox' }, {}, { models: db.models }
    ).catch((caught) => caught);

    expect(error).toMatchObject({ statusCode: 404, message: 'This scenario is not published' });
    expect(error).not.toHaveProperty('shouldRedirectToScenarios');
  });
});
