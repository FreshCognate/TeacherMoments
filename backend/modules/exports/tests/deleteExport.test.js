import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { createJobMock } = vi.hoisted(() => ({
  createJobMock: vi.fn()
}));

vi.mock('#core/queues/helpers/createJob.js', () => ({ default: (...args) => createJobMock(...args) }));

import deleteExport from '../services/deleteExport.js';

const db = setupMongo();

describe('deleteExport (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createJobMock.mockResolvedValue({ id: 'job-1' });
  });

  it('throws 404 when no matching export is found for the user', async () => {
    await expect(
      deleteExport({ exportId: new mongoose.Types.ObjectId() }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404, message: 'Export not found' });

    expect(createJobMock).not.toHaveBeenCalled();
  });

  it('queues a DELETE_GENERATED_EXPORT job delayed by 30 minutes', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId, filePath: 'exports/2026/data.csv' });

    const result = await deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(createJobMock).toHaveBeenCalledWith({
      queue: 'exports',
      name: 'DELETE_GENERATED_EXPORT',
      delay: 30 * 60 * 1000,
      job: { exportId: String(record._id) }
    });
    expect(result).toEqual({ success: true });
  });

  it('leaves the export record in place until the job runs', async () => {
    const userId = new mongoose.Types.ObjectId();
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: userId });

    await deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: userId } });

    expect(await db.models.Export.findById(record._id).lean()).toBeTruthy();
  });

  it('does not queue a delete for an export owned by another user', async () => {
    const record = await db.models.Export.create({ exportType: 'USER_HISTORY', createdBy: new mongoose.Types.ObjectId() });

    await expect(
      deleteExport({ exportId: record._id }, {}, { models: db.models, user: { _id: new mongoose.Types.ObjectId() } })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(createJobMock).not.toHaveBeenCalled();
  });
});
