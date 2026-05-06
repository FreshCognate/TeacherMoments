import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponseSelector from './responseSelector.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

const responses = [
  {
    blockRef: 'b1',
    slideName: 'Intro',
    blockDisplayName: 'Input prompt',
    blockPrompt: 'What is your name?'
  },
  {
    blockRef: 'b2',
    slideName: 'Outro',
    blockDisplayName: 'Multiple choice',
    blockPrompt: 'Final answer?'
  }
];

describe('ResponseSelector', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the error Alert and skips the list when hasError is true', () => {
    render(
      <ResponseSelector
        hasError
        error="No prompts available"
        responses={responses}
        onResponseClicked={() => {}}
      />
    );
    expect(screen.getByText('No prompts available')).toBeInTheDocument();
    expect(screen.queryByText('What is your name?')).not.toBeInTheDocument();
  });

  it('renders one entry per response with slide and prompt info', () => {
    render(<ResponseSelector responses={responses} onResponseClicked={() => {}} />);
    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Input prompt')).toBeInTheDocument();
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
    expect(screen.getByText('Outro')).toBeInTheDocument();
  });

  it('checks the radio whose blockRef matches value', () => {
    render(<ResponseSelector responses={responses} value="b2" onResponseClicked={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it('fires onResponseClicked with the blockRef when an option is selected', async () => {
    const user = userEvent.setup();
    const onResponseClicked = vi.fn();

    render(<ResponseSelector responses={responses} onResponseClicked={onResponseClicked} />);
    await user.click(screen.getAllByRole('radio')[0]);

    expect(onResponseClicked).toHaveBeenCalledWith('b1');
  });
});
