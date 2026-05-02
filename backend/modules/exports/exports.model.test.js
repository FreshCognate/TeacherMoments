import { describe, it, expect, beforeAll } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../tests/with-mongo.js';
import schema from './exports.schema.js';

setupMongo(mongoose);

let Export;

beforeAll(() => {
  Export = mongoose.model('Export', new mongoose.Schema(schema));
});

describe('exports model (in-memory mongo)', () => {
  it('persists and retrieves a document', async () => {
    const created = await Export.create({
      exportType: 'SCENARIO_RESPONSES',
      fileName: 'report.csv'
    });

    const found = await Export.findById(created._id).lean();

    expect(found).toMatchObject({
      exportType: 'SCENARIO_RESPONSES',
      status: 'PENDING',
      fileName: 'report.csv'
    });
  });

  it('rejects invalid exportType values', async () => {
    await expect(Export.create({ exportType: 'BOGUS' })).rejects.toThrow();
  });
});
