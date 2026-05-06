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

import openDuplicateScenarioModal from '../helpers/openDuplicateScenarioModal';
import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';

describe('openDuplicateScenarioModal', () => {
  beforeEach(() => {
    (addModal as any).mockClear();
    (axios.post as any).mockReset();
  });

  it('opens a confirmation modal titled "Duplicate scenario" with Cancel/Confirm actions', () => {
    openDuplicateScenarioModal({ scenarioId: 'scenario-1', router: { navigate: () => {} } });

    expect(addModal).toHaveBeenCalledTimes(1);
    const [config] = (addModal as any).mock.calls[0];
    expect(config.title).toBe('Duplicate scenario');
    expect(config.actions.map((a: any) => a.type)).toEqual(['CANCEL', 'CONFIRM']);
  });

  it('POSTs to /api/scenarios with the scenarioId and navigates to the new scenario when CONFIRM fires', async () => {
    const navigate = vi.fn();
    (axios.post as any).mockResolvedValue({
      data: { scenario: { _id: 'scenario-2' } }
    });

    openDuplicateScenarioModal({ scenarioId: 'scenario-1', router: { navigate } });

    const [, callback] = (addModal as any).mock.calls[0];
    await callback('ACTION', { type: 'CONFIRM' });

    expect(axios.post).toHaveBeenCalledWith('/api/scenarios', { scenarioId: 'scenario-1' });
    expect(navigate).toHaveBeenCalledWith('/scenarios/scenario-2/create');
  });

  it('does not POST when the CANCEL action fires', () => {
    openDuplicateScenarioModal({ scenarioId: 'scenario-1', router: { navigate: () => {} } });

    const [, callback] = (addModal as any).mock.calls[0];
    callback('ACTION', { type: 'CANCEL' });

    expect(axios.post).not.toHaveBeenCalled();
  });
});
