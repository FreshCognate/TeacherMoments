import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlocksEditorItem from './blocksEditorItem.jsx';

const block = { _id: 'b1', blockType: 'TEXT', sortOrder: 1 };

describe('BlocksEditorItem', () => {
  it('renders the block display name', () => {
    render(
      <BlocksEditorItem
        block={block}
        isLastBlock={false}
        isSelected={false}
        onDeleteBlockClicked={() => {}}
        onSortUpClicked={() => {}}
        onSortDownClicked={() => {}}
        onEditBlockClicked={() => {}}
      />
    );
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('fires onEditBlockClicked with the block id when Edit is clicked', async () => {
    const user = userEvent.setup();
    const onEditBlockClicked = vi.fn();

    render(
      <BlocksEditorItem
        block={block}
        isLastBlock={false}
        isSelected={false}
        onDeleteBlockClicked={() => {}}
        onSortUpClicked={() => {}}
        onSortDownClicked={() => {}}
        onEditBlockClicked={onEditBlockClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEditBlockClicked).toHaveBeenCalledWith('b1');
  });

  it('fires onDeleteBlockClicked with the block id when delete is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteBlockClicked = vi.fn();
    const { container } = render(
      <BlocksEditorItem
        block={block}
        isLastBlock={false}
        isSelected={false}
        onDeleteBlockClicked={onDeleteBlockClicked}
        onSortUpClicked={() => {}}
        onSortDownClicked={() => {}}
        onEditBlockClicked={() => {}}
      />
    );

    const buttons = container.querySelectorAll('button');
    await user.click(buttons[1]);
    expect(onDeleteBlockClicked).toHaveBeenCalledWith('b1');
  });

  it('hides the sort-up button when sortOrder is 0 (first block)', () => {
    const { container } = render(
      <BlocksEditorItem
        block={{ ...block, sortOrder: 0 }}
        isLastBlock={false}
        isSelected={false}
        onDeleteBlockClicked={() => {}}
        onSortUpClicked={() => {}}
        onSortDownClicked={() => {}}
        onEditBlockClicked={() => {}}
      />
    );
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });

  it('hides the sort-down button when isLastBlock is true', () => {
    const { container } = render(
      <BlocksEditorItem
        block={block}
        isLastBlock={true}
        isSelected={false}
        onDeleteBlockClicked={() => {}}
        onSortUpClicked={() => {}}
        onSortDownClicked={() => {}}
        onEditBlockClicked={() => {}}
      />
    );
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });
});
