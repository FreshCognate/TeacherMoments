import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-player', () => ({
  default: ({ url }) => <div data-testid="react-player" data-url={url}>player</div>
}));

import MediaBlockPlayer from './mediaBlockPlayer.jsx';

describe('MediaBlockPlayer', () => {
  it('renders an empty placeholder when no mediaUrl is provided', () => {
    render(<MediaBlockPlayer />);
    expect(screen.getByText('No media selected')).toBeInTheDocument();
    expect(screen.queryByTestId('react-player')).not.toBeInTheDocument();
  });

  it('renders the player and a Loading overlay when mediaUrl is set but isReady is false', () => {
    render(<MediaBlockPlayer mediaUrl="https://example.com/clip.mp4" isReady={false} />);
    expect(screen.getByTestId('react-player')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders only the player when isReady is true', () => {
    render(<MediaBlockPlayer mediaUrl="https://example.com/clip.mp4" isReady={true} />);
    expect(screen.getByTestId('react-player')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
