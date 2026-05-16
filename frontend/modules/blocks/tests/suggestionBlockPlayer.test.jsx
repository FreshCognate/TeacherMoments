import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SuggestionBlockPlayer from '../components/suggestionBlockPlayer.jsx';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = () => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => ({ language: 'en-US' }) },
    container: { props: {} }
  });
};

describe('SuggestionBlockPlayer', () => {
  beforeEach(() => {
    seedApp();
  });

  it('renders the body inside an Alert', () => {
    render(<SuggestionBlockPlayer block={{ 'en-US-body': 'Try this hint' }} />);
    expect(screen.getByText('Try this hint')).toBeInTheDocument();
  });

  it('maps suggestionType "INFO" to the info Alert variant (primary-coloured icon wrapper)', () => {
    const { container } = render(
      <SuggestionBlockPlayer block={{ 'en-US-body': 'hi', suggestionType: 'INFO' }} />
    );
    expect(container.querySelector('.bg-primary-regular')).toBeInTheDocument();
  });

  it('maps suggestionType "WARNING" to the warning Alert variant', () => {
    const { container } = render(
      <SuggestionBlockPlayer block={{ 'en-US-body': 'hi', suggestionType: 'WARNING' }} />
    );
    expect(container.querySelector('.bg-warning-regular')).toBeInTheDocument();
  });
});
