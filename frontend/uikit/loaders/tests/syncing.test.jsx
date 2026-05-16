import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Syncing from '../components/syncing.jsx';

describe('Syncing', () => {
  it('returns null when isSyncing is false', () => {
    const { container } = render(<Syncing isSyncing={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the animated bar when isSyncing is true', () => {
    const { container } = render(<Syncing isSyncing={true} />);
    expect(container.firstChild).not.toBeNull();
    expect(container.querySelector('.bg-primary-light')).toBeInTheDocument();
  });
});
