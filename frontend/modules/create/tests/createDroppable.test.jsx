import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../components/createDropzone', () => ({
  default: ({ id, sortOrder }) => (
    <div data-testid="dropzone-stub">dropzone:{id}:{sortOrder}</div>
  )
}));

vi.mock('../components/createSortableItem', () => ({
  default: ({ item, index }) => (
    <div data-testid="sortable-item">item:{item.name}:index:{index}</div>
  )
}));

import CreateDroppable from '../components/createDroppable';

const items = [
  { _id: 'a', name: 'A' },
  { _id: 'b', name: 'B' }
];

describe('CreateDroppable', () => {
  it('renders a leading dropzone with sortOrder 0', () => {
    render(
      <CreateDroppable
        id="root"
        items={items}
        data={{ type: 'SLIDES' }}
        renderItem={() => null}
      />
    );

    expect(screen.getByTestId('dropzone-stub')).toHaveTextContent('dropzone:root:0');
  });

  it('renders one sortable item per entry, threading the index', () => {
    render(
      <CreateDroppable
        id="root"
        items={items}
        data={{ type: 'SLIDES' }}
        renderItem={() => null}
      />
    );

    const sortableItems = screen.getAllByTestId('sortable-item');
    expect(sortableItems).toHaveLength(2);
    expect(sortableItems[0]).toHaveTextContent('item:A:index:0');
    expect(sortableItems[1]).toHaveTextContent('item:B:index:1');
  });
});
