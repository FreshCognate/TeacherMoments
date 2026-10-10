import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../components/createNavigationActions', () => ({
  default: ({ parentStemSlideId, isInRootStem, onAddSlideClicked }) => (
    <div
      data-testid="actions-stub"
      data-parent-stem-slide-id={String(parentStemSlideId)}
      data-in-root-stem={String(isInRootStem)}
    >
      <button onClick={onAddSlideClicked}>add slide</button>
    </div>
  )
}));

vi.mock('../containers/createNavigationStemContainer', () => ({
  default: ({ scenarioId, isInRootStem }) => (
    <div
      data-testid="navigation-stem-stub"
      data-scenario-id={scenarioId}
      data-in-root-stem={String(isInRootStem)}
    />
  )
}));

import CreateNavigation from '../components/createNavigation';

const baseProps = {
  scenarioId: 'scenario-1',
  parentStemSlideId: 'parent-slide-1',
  isCreating: false,
  isInRootStem: true,
  onAddSlideClicked: () => {},
  onBackToParentClicked: () => {}
};

describe('CreateNavigation', () => {
  it('renders the actions and the active stem navigation', () => {
    render(<CreateNavigation {...baseProps} />);
    expect(screen.getByTestId('actions-stub')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-stem-stub')).toHaveAttribute('data-scenario-id', 'scenario-1');
  });

  it('passes the parent stem slide id to the actions', () => {
    render(<CreateNavigation {...baseProps} />);
    expect(screen.getByTestId('actions-stub')).toHaveAttribute('data-parent-stem-slide-id', 'parent-slide-1');
  });

  it('passes isInRootStem to both the actions and the stem navigation', () => {
    render(<CreateNavigation {...baseProps} isInRootStem={false} />);
    expect(screen.getByTestId('actions-stub')).toHaveAttribute('data-in-root-stem', 'false');
    expect(screen.getByTestId('navigation-stem-stub')).toHaveAttribute('data-in-root-stem', 'false');
  });

  it('calls onAddSlideClicked when the actions add button is clicked', async () => {
    const user = userEvent.setup();
    const onAddSlideClicked = vi.fn();
    render(<CreateNavigation {...baseProps} onAddSlideClicked={onAddSlideClicked} />);
    await user.click(screen.getByRole('button', { name: /add slide/ }));
    expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
  });
});
