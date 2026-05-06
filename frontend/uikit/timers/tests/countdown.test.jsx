import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import Countdown from './countdown.jsx';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the initial value with a "s" suffix', () => {
    const { container } = render(<Countdown value={10} onFinish={() => {}} />);
    expect(container.firstChild).toHaveTextContent('10s');
  });

  it('decrements every second', () => {
    const { container } = render(<Countdown value={3} onFinish={() => {}} />);
    expect(container.firstChild).toHaveTextContent('3s');

    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.firstChild).toHaveTextContent('2s');

    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.firstChild).toHaveTextContent('1s');
  });

  it('calls onFinish when timeLeft reaches 0', () => {
    const onFinish = vi.fn();
    render(<Countdown value={1} onFinish={onFinish} />);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
