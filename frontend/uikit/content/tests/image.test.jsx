import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Image from '../components/image.jsx';

describe('Image', () => {
  it('renders an img element with the provided src', () => {
    const { container } = render(<Image src="/foo.png" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/foo.png');
  });

  it('applies a circular shape class when shape is "CIRCLE"', () => {
    const { container } = render(<Image src="/foo.png" shape="CIRCLE" />);
    expect(container.querySelector('img')).toHaveClass('rounded-full');
  });

  it('applies a square aspect class when shape is "SQUARE"', () => {
    const { container } = render(<Image src="/foo.png" shape="SQUARE" />);
    expect(container.querySelector('img')).toHaveClass('aspect-square');
  });

  it('applies an 8px border radius when borderRadius is 8 and shape is not "CIRCLE"', () => {
    const { container } = render(<Image src="/foo.png" shape="LANDSCAPE" borderRadius={8} />);
    expect(container.querySelector('img')).toHaveClass('rounded-[8px]');
  });
});
