import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

let capturedProps: any = null;

vi.mock('~/modules/analytics/containers/analyticsContainer', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="analytics-stub" />;
  }
}));

import UserHistory from '../components/userHistory';

describe('UserHistory', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('gives History its own line for when it is empty', () => {
    render(<UserHistory responses={[]} isLoading={false} />);
    expect(capturedProps.viewType).toBe('byUserScenarios');
    expect(capturedProps.emptyBody).toBe('Scenarios you take appear here.');
  });
});
