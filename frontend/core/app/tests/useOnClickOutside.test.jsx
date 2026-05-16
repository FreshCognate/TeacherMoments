import { describe, it, expect, vi } from 'vitest';
import { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import useOnClickOutside from '../hooks/useOnClickOutside.js';

const Probe = ({ handler, isActive }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, handler, isActive);
  return (
    <div>
      <div ref={ref} data-testid="inside">inside</div>
      <div data-testid="outside">outside</div>
    </div>
  );
};

describe('useOnClickOutside', () => {
  it('does not call the handler when clicking inside the ref', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe handler={handler} />);

    fireEvent.mouseDown(getByTestId('inside'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('calls the handler when clicking outside the ref', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe handler={handler} />);

    fireEvent.mouseDown(getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call the handler when isActive is false', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe handler={handler} isActive={false} />);

    fireEvent.mouseDown(getByTestId('outside'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes its listeners on unmount', () => {
    const handler = vi.fn();
    const { getByTestId, unmount } = render(<Probe handler={handler} />);

    unmount();
    fireEvent.mouseDown(document.body);
    expect(handler).not.toHaveBeenCalled();
  });
});
