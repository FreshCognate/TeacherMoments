import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../components/array.formField', () => ({
  default: (props) => (
    <div>
      <button type="button" onClick={props.onAddActionClicked}>add</button>
      <button type="button" onClick={() => props.onRemoveActionClicked('id-1')}>remove</button>
      <button
        type="button"
        onClick={() => props.onUpdateAction('id-1', { update: { name: 'updated' } })}
      >
        update
      </button>
      <button type="button" onClick={() => props.onSortActionUpClicked(1)}>up</button>
      <button type="button" onClick={() => props.onSortActionDownClicked(0)}>down</button>
    </div>
  )
}));

import './arrayContainer.formField.jsx';
import Fields from '~/core/forms/forms.fields';

const ArrayFormFieldContainer = Fields.Array;

const buildItems = () => [
  { _id: 'id-1', name: 'first' },
  { _id: 'id-2', name: 'second' }
];

describe('ArrayFormFieldContainer', () => {
  it('appends an empty action to value and calls updateField when add is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();
    const value = buildItems();

    render(<ArrayFormFieldContainer value={value} schema={{}} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'add' }));

    expect(updateField).toHaveBeenCalledTimes(1);
    expect(updateField.mock.calls[0][0]).toHaveLength(3);
    expect(updateField.mock.calls[0][0][2]).toEqual({});
  });

  it('removes the matching action when remove is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();
    const value = buildItems();

    render(<ArrayFormFieldContainer value={value} schema={{}} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'remove' }));

    expect(updateField.mock.calls[0][0]).toEqual([{ _id: 'id-2', name: 'second' }]);
  });

  it('merges updates into the matching action when update is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();
    const value = buildItems();

    render(<ArrayFormFieldContainer value={value} schema={{}} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'update' }));

    expect(updateField.mock.calls[0][0]).toEqual([
      { _id: 'id-1', name: 'updated' },
      { _id: 'id-2', name: 'second' }
    ]);
  });

  it('moves an item up by one when sort up is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();
    const value = buildItems();

    render(<ArrayFormFieldContainer value={value} schema={{}} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'up' }));

    expect(updateField.mock.calls[0][0]).toEqual([
      { _id: 'id-2', name: 'second' },
      { _id: 'id-1', name: 'first' }
    ]);
  });

  it('moves an item down by one when sort down is clicked', async () => {
    const user = userEvent.setup();
    const updateField = vi.fn();
    const value = buildItems();

    render(<ArrayFormFieldContainer value={value} schema={{}} updateField={updateField} />);
    await user.click(screen.getByRole('button', { name: 'down' }));

    expect(updateField.mock.calls[0][0]).toEqual([
      { _id: 'id-2', name: 'second' },
      { _id: 'id-1', name: 'first' }
    ]);
  });
});
