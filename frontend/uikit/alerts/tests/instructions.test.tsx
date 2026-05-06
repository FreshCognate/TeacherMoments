import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Instructions from '../components/instructions';

describe('Instructions', () => {
  it('renders the main title', () => {
    render(<Instructions title="How to play" instructions={[]} />);
    expect(screen.getByText('How to play')).toBeInTheDocument();
  });

  it('does not render the main title when an empty string is passed', () => {
    render(<Instructions title="" instructions={[]} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders each instruction title and body', () => {
    render(
      <Instructions
        title="Steps"
        instructions={[
          { title: 'Step one', body: 'Do the first thing' },
          { title: 'Step two', body: 'Do the second thing' }
        ]}
      />
    );

    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Step two')).toBeInTheDocument();
    expect(screen.getByText('Do the first thing')).toBeInTheDocument();
    expect(screen.getByText('Do the second thing')).toBeInTheDocument();
  });

  it('skips an instruction body when only a title is provided', () => {
    render(
      <Instructions
        title="Steps"
        instructions={[{ title: 'Step one' }]}
      />
    );

    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.queryByText('Do the first thing')).not.toBeInTheDocument();
  });

  it('skips an instruction title when only a body is provided', () => {
    render(
      <Instructions
        title="Steps"
        instructions={[{ body: 'Body only' }]}
      />
    );

    expect(screen.getByText('Body only')).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });
});
