import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DialogModalLightbox from '../components/dialogModalLightbox.jsx';

describe('DialogModalLightbox', () => {
  it('renders its children', () => {
    render(<DialogModalLightbox>hello</DialogModalLightbox>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('uses the modal opacity (80) class by default', () => {
    const { container } = render(<DialogModalLightbox>x</DialogModalLightbox>);
    expect(container.querySelector('.bg-opacity-80')).toBeInTheDocument();
  });

  it('uses the side-panel opacity (40) class when isSidePanel is true', () => {
    const { container } = render(<DialogModalLightbox isSidePanel>x</DialogModalLightbox>);
    expect(container.querySelector('.bg-opacity-40')).toBeInTheDocument();
  });
});
