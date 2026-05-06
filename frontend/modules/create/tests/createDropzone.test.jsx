import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import CreateDropzone from '../components/createDropzone';

const renderInDnd = (ui) => render(<DndContext>{ui}</DndContext>);

describe('CreateDropzone', () => {
  it('renders an idle dropzone (no active drag, h-0)', () => {
    const { container } = renderInDnd(
      <CreateDropzone id="dropzone-1" data={{ type: 'SLIDES' }} sortOrder={0} />
    );

    const dropzone = container.querySelector('div.absolute');
    expect(dropzone).toBeInTheDocument();
    expect(dropzone?.className).toContain('h-0');
    expect(dropzone?.className).toContain('border-transparent');
  });
});
