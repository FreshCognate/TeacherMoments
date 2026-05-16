import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('~/core/forms/containers/formContainer', () => ({
  default: () => <div data-testid="form-stub">form</div>
}));

import CohortSettings from '../components/cohortSettings';

const baseProps = {
  schema: {},
  cohort: { _id: 'cohort-1', name: 'Spring Cohort' },
  isLoading: false,
  onUpdateCohort: () => {},
  onDeleteCohortClicked: () => {}
};

describe('CohortSettings', () => {
  it('renders nothing when isLoading is true', () => {
    const { container } = render(<CohortSettings {...baseProps} isLoading={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the title, the form, and the Delete button when not loading', () => {
    render(<CohortSettings {...baseProps} />);
    expect(screen.getByText('Cohort settings')).toBeInTheDocument();
    expect(screen.getByTestId('form-stub')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete cohort' })).toBeInTheDocument();
  });

  it('fires onDeleteCohortClicked when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteCohortClicked = vi.fn();

    render(<CohortSettings {...baseProps} onDeleteCohortClicked={onDeleteCohortClicked} />);
    await user.click(screen.getByRole('button', { name: 'Delete cohort' }));

    expect(onDeleteCohortClicked).toHaveBeenCalledTimes(1);
  });
});
