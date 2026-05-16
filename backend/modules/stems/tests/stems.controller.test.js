import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  getStemsByScenarioIdMock,
  getStemByIdMock,
  createStemMock,
  updateStemByIdMock,
  deleteStemByIdMock
} = vi.hoisted(() => ({
  getStemsByScenarioIdMock: vi.fn(),
  getStemByIdMock: vi.fn(),
  createStemMock: vi.fn(),
  updateStemByIdMock: vi.fn(),
  deleteStemByIdMock: vi.fn()
}));

vi.mock('../services/getStemsByScenarioId.js', () => ({ default: (...args) => getStemsByScenarioIdMock(...args) }));
vi.mock('../services/getStemById.js', () => ({ default: (...args) => getStemByIdMock(...args) }));
vi.mock('../services/createStem.js', () => ({ default: (...args) => createStemMock(...args) }));
vi.mock('../services/updateStemById.js', () => ({ default: (...args) => updateStemByIdMock(...args) }));
vi.mock('../services/deleteStemById.js', () => ({ default: (...args) => deleteStemByIdMock(...args) }));

import controller from '../stems.controller.js';

describe('stems.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('all forwards scenarioId and isDeleted to getStemsByScenarioId', async () => {
    getStemsByScenarioIdMock.mockResolvedValue({ stems: [] });

    const result = await controller.all(
      { query: { scenarioId: 's1', isDeleted: true } },
      { ctx: 1 }
    );

    expect(getStemsByScenarioIdMock).toHaveBeenCalledWith(
      { scenarioId: 's1' },
      { isDeleted: true },
      { ctx: 1 }
    );
    expect(result).toEqual({ stems: [] });
  });

  it('create remaps scenarioId → scenario and wraps result under "stem"', async () => {
    createStemMock.mockResolvedValue({ _id: 'st1' });

    const result = await controller.create(
      { body: { scenarioId: 's1', stemRef: 'sr1', slideRef: 'slR1', sortOrder: 0 } },
      { ctx: 1 }
    );

    expect(createStemMock).toHaveBeenCalledWith(
      { scenario: 's1', stemRef: 'sr1', slideRef: 'slR1', sortOrder: 0 },
      {},
      { ctx: 1 }
    );
    expect(result).toEqual({ stem: { _id: 'st1' } });
  });

  it('read passes the URL param as stemId and wraps under "stem"', async () => {
    getStemByIdMock.mockResolvedValue({ _id: 'st1' });

    const result = await controller.read({ param: 'st1' }, { ctx: 1 });

    expect(getStemByIdMock).toHaveBeenCalledWith({ stemId: 'st1' }, {}, { ctx: 1 });
    expect(result).toEqual({ stem: { _id: 'st1' } });
  });

  it('update forwards body as the update payload', async () => {
    updateStemByIdMock.mockResolvedValue({ _id: 'st1', name: 'Renamed' });

    const result = await controller.update(
      { param: 'st1', body: { name: 'Renamed' } },
      { ctx: 1 }
    );

    expect(updateStemByIdMock).toHaveBeenCalledWith(
      { stemId: 'st1', update: { name: 'Renamed' } },
      {},
      { ctx: 1 }
    );
    expect(result).toEqual({ stem: { _id: 'st1', name: 'Renamed' } });
  });

  it('delete passes the URL param as stemId and wraps under "stem"', async () => {
    deleteStemByIdMock.mockResolvedValue({ _id: 'st1', isDeleted: true });

    const result = await controller.delete({ param: 'st1' }, { ctx: 1 });

    expect(deleteStemByIdMock).toHaveBeenCalledWith({ stemId: 'st1' }, {}, { ctx: 1 });
    expect(result).toEqual({ stem: { _id: 'st1', isDeleted: true } });
  });
});
