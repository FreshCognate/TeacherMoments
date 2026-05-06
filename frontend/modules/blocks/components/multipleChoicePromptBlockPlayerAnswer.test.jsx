import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleChoicePromptBlockPlayerAnswer from './multipleChoicePromptBlockPlayerAnswer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

const baseOption = { _id: 'opt-1', 'en-US-text': 'Option A' };

describe('MultipleChoicePromptBlockPlayerAnswer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders a radio when not multi-select', () => {
    render(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={false}
        isSelected={false}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders a checkbox when multi-select', () => {
    render(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={true}
        isSelected={false}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('marks the input as checked when isSelected is true', () => {
    render(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={false}
        isSelected={true}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('disables the input when isComplete or isResponseBlock is true', () => {
    const { rerender } = render(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={false}
        isSelected={false}
        isComplete={true}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByRole('radio')).toBeDisabled();

    rerender(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={false}
        isSelected={false}
        isResponseBlock={true}
        onAnswerClicked={() => {}}
      />
    );
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('fires onAnswerClicked with the option id when toggled', async () => {
    const user = userEvent.setup();
    const onAnswerClicked = vi.fn();

    render(
      <MultipleChoicePromptBlockPlayerAnswer
        option={baseOption}
        isMultiSelect={false}
        isSelected={false}
        onAnswerClicked={onAnswerClicked}
      />
    );

    await user.click(screen.getByRole('radio'));
    expect(onAnswerClicked).toHaveBeenCalledWith('opt-1');
  });
});
