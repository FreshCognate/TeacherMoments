import { describe, it, expect } from 'vitest';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';

describe('getCohortScenarioStatus', () => {
  it('returns the not-started status when no run is provided', () => {
    expect(getCohortScenarioStatus(undefined as any)).toEqual({
      icon: 'notStarted',
      text: 'This scenario has not been started'
    });
  });

  it('returns the started status when the run exists but is incomplete', () => {
    expect(getCohortScenarioStatus({ isComplete: false } as any)).toEqual({
      icon: 'started',
      text: 'This scenario has been started'
    });
  });

  it('returns the complete status when the run is complete', () => {
    expect(getCohortScenarioStatus({ isComplete: true } as any)).toEqual({
      icon: 'complete',
      text: 'This scenario has been completed'
    });
  });
});
