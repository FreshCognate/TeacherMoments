import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CreateNavigationStaticSlide from '../components/createNavigationStaticSlide';

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CreateNavigationStaticSlide', () => {
  it('renders the label text', () => {
    renderInRouter(
      <CreateNavigationStaticSlide
        label="Consent slide"
        slideId="CONSENT"
        scenarioId="scenario-1"
        isSelected={false}
      />
    );
    expect(screen.getByText('Consent slide')).toBeInTheDocument();
  });

  it('links to the create route with slide as a query parameter', () => {
    renderInRouter(
      <CreateNavigationStaticSlide
        label="Summary slide"
        slideId="SUMMARY"
        scenarioId="scenario-1"
        isSelected={false}
      />
    );
    const link = screen.getByRole('link', { name: 'Summary slide' });
    expect(link).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=SUMMARY');
  });

  it('applies the selected outline class when isSelected is true', () => {
    const { container } = renderInRouter(
      <CreateNavigationStaticSlide
        label="Consent slide"
        slideId="CONSENT"
        scenarioId="scenario-1"
        isSelected={true}
      />
    );
    expect(container.querySelector('.outline.outline-blue-500')).toBeInTheDocument();
  });

  it('does not apply the selected outline class when isSelected is false', () => {
    const { container } = renderInRouter(
      <CreateNavigationStaticSlide
        label="Consent slide"
        slideId="CONSENT"
        scenarioId="scenario-1"
        isSelected={false}
      />
    );
    expect(container.querySelector('.outline.outline-blue-500')).not.toBeInTheDocument();
  });
});
