import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { connectDatabaseMock, findByIdAndUpdateMock } = vi.hoisted(() => ({
  connectDatabaseMock: vi.fn(),
  findByIdAndUpdateMock: vi.fn()
}));

vi.mock('../../../backend/core/databases/helpers/connectDatabase.js', () => ({
  default: (...args) => connectDatabaseMock(...args)
}));

import updateAssetToProcessed from '../updateAssetToProcessed.js';

const FIXED_NOW = new Date('2026-05-08T12:00:00Z');

describe('updateAssetToProcessed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDatabaseMock.mockResolvedValue({
      models: { Asset: { findByIdAndUpdate: findByIdAndUpdateMock } }
    });
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks the asset as processed with the current timestamp', async () => {
    await updateAssetToProcessed({ assetId: 'a1' });

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('a1', {
      hasBeenProcessed: true,
      isProcessing: false,
      processedAt: FIXED_NOW
    });
  });
});
