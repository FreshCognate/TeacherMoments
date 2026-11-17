import { describe, it, expect } from 'vitest';
import getCohortScenarioStatus from '../helpers/getCohortScenarioStatus';

describe('getCohortScenarioStatus', () => {
  it('returns the not-started status when no run is provided', () => {
    expect(getCohortScenarioStatus(undefined as any)).toEqual({
      icon: 'notStarted',
      text: "You haven't started this scenario"
    });
  });

  it('returns the started status when the run exists but is incomplete', () => {
    expect(getCohortScenarioStatus({ isComplete: false } as any)).toEqual({
      icon: 'started',
      text: "You've started this scenario"
    });
  });

  it('returns the complete status when the run is complete', () => {
    expect(getCohortScenarioStatus({ isComplete: true } as any)).toEqual({
      icon: 'complete',
      text: "You've finished this scenario"
    });
  });
});
