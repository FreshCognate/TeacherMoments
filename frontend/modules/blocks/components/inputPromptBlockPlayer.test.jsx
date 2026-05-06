import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./inputPromptAudioBlockPlayer', () => ({
  default: () => <div data-testid="audio-player">audio</div>
}));

import InputPromptBlockPlayer from './inputPromptBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

describe('InputPromptBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the audio variant when inputType is "AUDIO"', () => {
    render(
      <InputPromptBlockPlayer
        block={{ inputType: 'AUDIO', 'en-US-body': 'Speak now', requiredLength: 0 }}
        blockTracking={{}}
      />
    );
    expect(screen.getByTestId('audio-player')).toBeInTheDocument();
  });

  it('renders the text variant when inputType is "TEXT"', () => {
    render(
      <InputPromptBlockPlayer
        block={{ inputType: 'TEXT', 'en-US-body': 'Type now', requiredLength: 0 }}
        blockTracking={{ textValue: '' }}
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
  });

  it('renders the text variant when isAudioDisabled is true regardless of inputType', () => {
    render(
      <InputPromptBlockPlayer
        block={{ inputType: 'AUDIO', 'en-US-body': 'Body', requiredLength: 0 }}
        blockTracking={{ textValue: '' }}
        isAudioDisabled
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
  });

  it('renders the prompt body', () => {
    render(
      <InputPromptBlockPlayer
        block={{ inputType: 'TEXT', 'en-US-body': 'Type now', requiredLength: 0 }}
        blockTracking={{ textValue: '' }}
        onTextInputChanged={() => {}}
      />
    );
    expect(screen.getByText('Type now')).toBeInTheDocument();
  });
});
