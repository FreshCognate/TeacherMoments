import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextBlockPlayer from '../components/textBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (language = 'en-US') => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language }) },
    container: { props: {} }
  });
};

describe('TextBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the title and body for the active language', () => {
    render(
      <TextBlockPlayer
        block={{
          'en-US-title': 'Welcome',
          'en-US-body': 'Body content'
        }}
      />
    );
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders nothing for missing fields', () => {
    const { container } = render(<TextBlockPlayer block={{}} />);
    expect(container.querySelector('h1')).toBeNull();
  });
});
