import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Required from './required.jsx';

describe('Required', () => {
  it('renders nothing when isRequired is false', () => {
    const { container } = render(<Required isRequired={false} isComplete={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the "Required" label when isRequired but not complete', () => {
    render(<Required isRequired={true} isComplete={false} />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
  });

  it('renders the "Complete" label when isRequired and isComplete', () => {
    render(<Required isRequired={true} isComplete={true} />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('uses a title attribute describing the requirement', () => {
    const { container } = render(<Required isRequired={true} isComplete={false} />);
    expect(container.querySelector('[title="This prompt requires a response"]')).toBeInTheDocument();
  });
});
