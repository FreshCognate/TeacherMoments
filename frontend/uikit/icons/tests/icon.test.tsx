import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import Icon from './icon';

describe('Icon', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns null and warns when icon prop is missing', () => {
    const { container } = render(<Icon icon={undefined as unknown as string} />);
    expect(container.firstChild).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('returns null and warns when the icon name does not exist', () => {
    const { container } = render(<Icon icon="not-a-real-icon" />);
    expect(container.firstChild).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('not-a-real-icon icon does not exist');
  });

  it('renders an svg with the provided size', () => {
    const { container } = render(<Icon icon="confirm" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('defaults to size 24 when no size is provided', () => {
    const { container } = render(<Icon icon="confirm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('exposes ariaLabel and unsets aria-hidden when ariaLabel is provided', () => {
    const { container } = render(<Icon icon="confirm" ariaLabel="Confirmed" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Confirmed');
    expect(svg).toHaveAttribute('aria-hidden', 'false');
  });

  it('marks the svg as aria-hidden when no ariaLabel is provided', () => {
    const { container } = render(<Icon icon="confirm" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
