import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionBar from './actionBar';

describe('ActionBar', () => {
  it('renders no search, pagination, filters, sort, or actions by default', () => {
    render(<ActionBar />);

    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
    expect(screen.queryByText('Sort')).not.toBeInTheDocument();
  });

  it('renders the search input when hasSearch is true', () => {
    render(<ActionBar hasSearch searchPlaceholder="Search..." searchValue="" onSearchValueChange={() => {}} />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders action buttons and fires onActionClicked with the action key', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <ActionBar
        actions={[
          { action: 'create', text: 'Create' },
          { action: 'archive', text: 'Archive' }
        ]}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(onActionClicked).toHaveBeenCalledWith({ action: 'create' });

    await user.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onActionClicked).toHaveBeenCalledWith({ action: 'archive' });
  });

  it('disables an action button when its getIsDisabled returns true', () => {
    render(
      <ActionBar
        actions={[
          { action: 'delete', text: 'Delete', getIsDisabled: () => true }
        ]}
        onActionClicked={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  it('shows the selected filter text on the mobile filter dropdown when filter matches an option', () => {
    render(
      <ActionBar
        hasFilters
        filter="active"
        filters={[
          { value: 'active', text: 'Active' },
          { value: 'archived', text: 'Archived' }
        ]}
        onFiltersChanged={() => {}}
      />
    );

    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });

  it('falls back to "Filter" placeholder when filter does not match any option', () => {
    render(
      <ActionBar
        hasFilters
        filter="nope"
        filters={[
          { value: 'active', text: 'Active' }
        ]}
        onFiltersChanged={() => {}}
      />
    );

    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('falls back to "Sort" placeholder when sortBy does not match any option', () => {
    render(
      <ActionBar
        hasSortBy
        sortBy="nope"
        sortByOptions={[{ value: 'recent', text: 'Recent' }]}
        onSortByChanged={() => {}}
      />
    );

    expect(screen.getByText('Sort')).toBeInTheDocument();
  });

  it('opens the search overlay when the mobile search button is clicked, and closes it on cancel', async () => {
    const user = userEvent.setup();

    render(
      <ActionBar
        hasSearch
        searchPlaceholder="Search..."
        searchValue=""
        onSearchValueChange={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: 'Close search' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('button', { name: 'Close search' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close search' }));
    expect(screen.queryByRole('button', { name: 'Close search' })).not.toBeInTheDocument();
  });
});
