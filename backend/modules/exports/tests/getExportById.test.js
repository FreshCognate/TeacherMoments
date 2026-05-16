import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getDownloadSignedUrlMock } = vi.hoisted(() => ({ getDownloadSignedUrlMock: vi.fn() }));

vi.mock('../../assets/helpers/getDownloadSignedUrl.js', () => ({
  default: (...args) => getDownloadSignedUrlMock(...args)
}));

import getExportById from '../services/getExportById.js';

const buildModels = (exportRecord) => ({
  Export: {
    findOne: vi.fn(() => ({ lean: vi.fn().mockResolvedValue(exportRecord) }))
  }
});

describe('getExportById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries for an export owned by the requesting user', async () => {
    const models = buildModels({ _id: 'e1', status: 'PENDING' });

    await getExportById({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(models.Export.findOne).toHaveBeenCalledWith({ _id: 'e1', createdBy: 'u1' });
  });

  it('throws 404 when no export is found', async () => {
    const models = buildModels(null);

    await expect(getExportById({ exportId: 'missing' }, {}, { models, user: { _id: 'u1' } }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns a null downloadUrl when the export is not COMPLETED', async () => {
    const models = buildModels({ _id: 'e1', status: 'PENDING' });

    const result = await getExportById({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(result.downloadUrl).toBeNull();
    expect(getDownloadSignedUrlMock).not.toHaveBeenCalled();
  });

  it('returns a null downloadUrl when the export has no filePath', async () => {
    const models = buildModels({ _id: 'e1', status: 'COMPLETED' });

    const result = await getExportById({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(result.downloadUrl).toBeNull();
    expect(getDownloadSignedUrlMock).not.toHaveBeenCalled();
  });

  it('signs a download URL when the export is COMPLETED with a filePath', async () => {
    const exportRecord = { _id: 'e1', status: 'COMPLETED', filePath: 'exports/2026/data.csv' };
    const models = buildModels(exportRecord);
    getDownloadSignedUrlMock.mockResolvedValue('https://signed.example.com/download');

    const result = await getExportById({ exportId: 'e1' }, {}, { models, user: { _id: 'u1' } });

    expect(getDownloadSignedUrlMock).toHaveBeenCalledWith('exports/2026/data.csv');
    expect(result).toEqual({
      export: exportRecord,
      downloadUrl: 'https://signed.example.com/download'
    });
  });
});
