import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleChoicePromptBlockPlayer from './multipleChoicePromptBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

const block = {
  'en-US-body': 'Pick one',
  isRequired: false,
  isMultiSelect: false,
  options: [
    { _id: 'a', value: 'a', 'en-US-text': 'Apple' },
    { _id: 'b', value: 'b', 'en-US-text': 'Banana' }
  ]
};

describe('MultipleChoicePromptBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the question body and an answer per option', () => {
    render(
      <MultipleChoicePromptBlockPlayer
        block={block}
        blockTracking={{ selectedOptions: [] }}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByText('Pick one')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('marks an answer as selected when its value is in blockTracking.selectedOptions', () => {
    render(
      <MultipleChoicePromptBlockPlayer
        block={block}
        blockTracking={{ selectedOptions: ['a'] }}
        onAnswerClicked={() => {}}
      />
    );
    const inputs = screen.getAllByRole('radio');
    expect(inputs[0]).toBeChecked();
    expect(inputs[1]).not.toBeChecked();
  });

  it('forwards onAnswerClicked with the option id when an answer is clicked', async () => {
    const user = userEvent.setup();
    const onAnswerClicked = vi.fn();

    render(
      <MultipleChoicePromptBlockPlayer
        block={block}
        blockTracking={{ selectedOptions: [] }}
        onAnswerClicked={onAnswerClicked}
      />
    );

    await user.click(screen.getAllByRole('radio')[1]);
    expect(onAnswerClicked).toHaveBeenCalledWith('b');
  });
});
