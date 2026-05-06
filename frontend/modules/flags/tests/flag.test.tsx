import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Flag from '../components/flag';

const setHostname = (hostname: string) => {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true
  });
};

describe('Flag', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  });

  it('renders children on mit-tm.com', () => {
    setHostname('mit-tm.com');
    render(<Flag><span data-testid="flagged">visible</span></Flag>);
    expect(screen.getByTestId('flagged')).toBeInTheDocument();
  });

  it('renders children on staging.teachermoments.org', () => {
    setHostname('staging.teachermoments.org');
    render(<Flag><span data-testid="flagged">visible</span></Flag>);
    expect(screen.getByTestId('flagged')).toBeInTheDocument();
  });

  it('renders nothing on other hostnames', () => {
    setHostname('teachermoments.org');
    const { container } = render(<Flag><span data-testid="flagged">hidden</span></Flag>);
    expect(screen.queryByTestId('flagged')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing on localhost', () => {
    setHostname('localhost');
    const { container } = render(<Flag><span data-testid="flagged">hidden</span></Flag>);
    expect(container).toBeEmptyDOMElement();
  });
});
