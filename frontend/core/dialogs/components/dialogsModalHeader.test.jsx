import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DialogsModalHeader from './dialogsModalHeader.jsx';

describe('DialogsModalHeader', () => {
  it('returns null when title, body, and icon are all missing', () => {
    const { container } = render(<DialogsModalHeader />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the title and body', () => {
    render(<DialogsModalHeader title="Are you sure?" body="This cannot be undone" />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument();
  });

  it('renders an icon when icon is provided', () => {
    const { container } = render(<DialogsModalHeader icon="warning" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
