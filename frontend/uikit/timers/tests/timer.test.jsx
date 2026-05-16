import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Timer from '../components/timer.jsx';

describe('Timer', () => {
  it('renders 0:00 initially', () => {
    const { container } = render(<Timer maxTime={60} />);
    expect(container.firstChild).toHaveTextContent('0:00');
  });
});
