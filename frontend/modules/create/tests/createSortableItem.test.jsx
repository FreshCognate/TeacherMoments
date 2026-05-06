import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';

vi.mock('../components/createDropzone', () => ({
  default: ({ id, sortOrder }) => (
    <div data-testid="dropzone-stub">dropzone:{id}:{sortOrder}</div>
  )
}));

import CreateSortableItem from '../components/createSortableItem';

const renderInDnd = (ui) => render(<DndContext>{ui}</DndContext>);

describe('CreateSortableItem', () => {
  it('calls renderItem with the items, item, index, and draggingOptions', () => {
    const renderItem = vi.fn(({ item }) => <div>item:{item.name}</div>);
    const items = [{ _id: 'a', name: 'A' }];

    renderInDnd(
      <CreateSortableItem
        id="a"
        items={items}
        item={items[0]}
        index={0}
        data={{ type: 'SLIDES' }}
        renderItem={renderItem}
      />
    );

    expect(renderItem).toHaveBeenCalledTimes(1);
    const call = renderItem.mock.calls[0][0];
    expect(call.items).toBe(items);
    expect(call.item).toBe(items[0]);
    expect(call.index).toBe(0);
    expect(call.draggingOptions.isDragging).toBe(false);
    expect(typeof call.draggingOptions.setNodeRef).toBe('function');
  });

  it('renders a trailing dropzone with sortOrder = index + 1 when not dragging', () => {
    const items = [{ _id: 'a', name: 'A' }];

    renderInDnd(
      <CreateSortableItem
        id="a"
        items={items}
        item={items[0]}
        index={0}
        data={{ type: 'SLIDES' }}
        renderItem={() => <div />}
      />
    );

    expect(screen.getByTestId('dropzone-stub')).toHaveTextContent('dropzone:a:1');
  });
});
