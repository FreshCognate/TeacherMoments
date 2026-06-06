import { describe, it, expect } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

const db = setupMongo();

describe('exports model (in-memory mongo)', () => {
  it('persists and retrieves a document', async () => {
    const created = await db.models.Export.create({
      exportType: 'SCENARIO_RESPONSES',
      fileName: 'report.csv'
    });

    const found = await db.models.Export.findById(created._id).lean();

    expect(found).toMatchObject({
      exportType: 'SCENARIO_RESPONSES',
      status: 'PENDING',
      fileName: 'report.csv'
    });
  });

  it('rejects invalid exportType values', async () => {
    await expect(db.models.Export.create({ exportType: 'BOGUS' })).rejects.toThrow();
  });
});
