import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('~/core/dialogs/helpers/addModal', () => ({
  default: vi.fn()
}));
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));
vi.mock('~/core/app/helpers/handleRequestError', () => ({
  default: vi.fn()
}));

import openCreateScenarioModal from '../helpers/openCreateScenarioModal';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';

describe('openCreateScenarioModal', () => {
  beforeEach(() => {
    (addModal as any).mockClear();
    (axios.post as any).mockReset();
  });

  it('opens a modal titled "Create scenario" with name and accessType fields and Cancel/Create actions', () => {
    openCreateScenarioModal({ router: { navigate: () => {} } });

    expect(addModal).toHaveBeenCalledTimes(1);
    const [config] = (addModal as any).mock.calls[0];
    expect(config.title).toBe('Create scenario');
    expect(Object.keys(config.schema)).toEqual(['name', 'accessType']);
    expect(config.actions.map((a: any) => a.type)).toEqual(['CANCEL', 'CREATE']);
  });

  it('POSTs to /api/scenarios with the modal model when the CREATE action fires', async () => {
    const navigate = vi.fn();
    (axios.post as any).mockResolvedValue({
      data: { scenario: { _id: 'scenario-1' } }
    });

    openCreateScenarioModal({ router: { navigate } });

    const [, callback] = (addModal as any).mock.calls[0];
    const modalModel = { name: 'New scenario', accessType: 'PRIVATE' };
    await callback('ACTION', { type: 'CREATE', modal: modalModel });

    expect(axios.post).toHaveBeenCalledWith('/api/scenarios', modalModel);
    expect(navigate).toHaveBeenCalledWith('/scenarios/scenario-1/create');
  });

  it('does not POST when the CANCEL action fires', () => {
    openCreateScenarioModal({ router: { navigate: () => {} } });

    const [, callback] = (addModal as any).mock.calls[0];
    callback('ACTION', { type: 'CANCEL', modal: {} });

    expect(axios.post).not.toHaveBeenCalled();
  });
});
