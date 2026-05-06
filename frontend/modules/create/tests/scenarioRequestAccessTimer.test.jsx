import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('~/uikit/timers/components/countdown', () => ({
  default: ({ value, onFinish }) => (
    <div data-testid="countdown-stub" onClick={onFinish}>
      countdown:{value}
    </div>
  )
}));

import ScenarioRequestAccessTimer from '../components/scenarioRequestAccessTimer';

describe('ScenarioRequestAccessTimer', () => {
  it('passes the value to the Countdown', () => {
    render(<ScenarioRequestAccessTimer value={30} onFinish={() => {}} />);
    expect(screen.getByTestId('countdown-stub')).toHaveTextContent('countdown:30');
  });

  it('passes onFinish through to the Countdown', () => {
    const onFinish = vi.fn();
    render(<ScenarioRequestAccessTimer value={30} onFinish={onFinish} />);
    screen.getByTestId('countdown-stub').click();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
