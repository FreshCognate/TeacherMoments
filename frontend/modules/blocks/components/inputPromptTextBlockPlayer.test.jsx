import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputPromptTextBlockPlayer from './inputPromptTextBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

describe('InputPromptTextBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the textarea with the placeholder and current value', () => {
    render(
      <InputPromptTextBlockPlayer
        block={{ 'en-US-placeholder': 'Type here', requiredLength: 0 }}
        blockTracking={{ textValue: 'hello' }}
        onTextInputChanged={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText('Type here');
    expect(textarea).toHaveValue('hello');
  });

  it('disables the textarea when blockTracking.isComplete is true', () => {
    render(
      <InputPromptTextBlockPlayer
        block={{ requiredLength: 0 }}
        blockTracking={{ textValue: '', isComplete: true }}
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('disables the textarea when isResponseBlock is true', () => {
    render(
      <InputPromptTextBlockPlayer
        block={{ requiredLength: 0 }}
        blockTracking={{ textValue: '' }}
        isResponseBlock
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows remaining required characters when isRequired is set', () => {
    render(
      <InputPromptTextBlockPlayer
        block={{ isRequired: true, requiredLength: 100 }}
        blockTracking={{ textValue: 'fifteen letters' }}
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByText('85 characters required')).toBeInTheDocument();
  });

  it('clamps remaining required characters at 0 when textValue exceeds requiredLength', () => {
    render(
      <InputPromptTextBlockPlayer
        block={{ isRequired: true, requiredLength: 5 }}
        blockTracking={{ textValue: 'a much longer answer' }}
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByText('0 characters required')).toBeInTheDocument();
  });

  it('forwards textarea change events to onTextInputChanged', () => {
    const onTextInputChanged = vi.fn();
    render(
      <InputPromptTextBlockPlayer
        block={{ requiredLength: 0 }}
        blockTracking={{ textValue: '' }}
        onTextInputChanged={onTextInputChanged}
      />
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
    expect(onTextInputChanged).toHaveBeenCalled();
  });
});
