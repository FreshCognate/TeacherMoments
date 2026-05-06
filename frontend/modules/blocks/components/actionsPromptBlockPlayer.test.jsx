import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionsPromptBlockPlayer from './actionsPromptBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

describe('ActionsPromptBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders a button per action with the localised text', () => {
    const block = {
      actions: [
        { _id: 'a', 'en-US-text': 'Continue' },
        { _id: 'b', 'en-US-text': 'Cancel' }
      ]
    };

    render(<ActionsPromptBlockPlayer block={block} onActionClicked={() => {}} />);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('fires onActionClicked with the full action object when clicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();
    const action = { _id: 'a', 'en-US-text': 'Continue' };

    render(<ActionsPromptBlockPlayer block={{ actions: [action] }} onActionClicked={onActionClicked} />);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onActionClicked).toHaveBeenCalledWith(action);
  });
});
