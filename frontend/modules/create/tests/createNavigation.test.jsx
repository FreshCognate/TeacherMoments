import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../components/createNavigationActions', () => ({
  default: ({ onAddSlideClicked }) => (
    <div data-testid="actions-stub">
      <button onClick={onAddSlideClicked}>add slide</button>
    </div>
  )
}));

vi.mock('../components/createNavigationStaticSlide', () => ({
  default: ({ label, slideId, isSelected }) => (
    <div data-testid={`static-slide-${slideId}`}>
      {label}:{String(isSelected)}
    </div>
  )
}));

vi.mock('../components/createNavigationSlide', () => ({
  default: ({ slide }) => (
    <div data-testid={`navigation-slide-${slide._id}`}>slide:{slide._id}</div>
  )
}));

vi.mock('../containers/createDroppableContainer', () => ({
  default: ({ items }) => (
    <div data-testid="droppable-stub">items:{items.length}</div>
  )
}));

vi.mock('../containers/createStemsContainer', () => ({
  default: () => <div data-testid="stems-stub">stems</div>
}));

vi.mock('~/modules/flags/components/flag', () => ({
  default: ({ children }) => <>{children}</>
}));

import CreateNavigation from '../components/createNavigation';

const baseProps = {
  scenarioId: 'scenario-1',
  slides: [{ _id: 'slide-1' }, { _id: 'slide-2' }],
  blocks: [],
  activeSlideId: 'slide-1',
  navigationMode: 'SLIDES',
  isCreating: false,
  deletingId: null,
  isDuplicating: false,
  activeStem: null,
  hasChildStems: false,
  onAddSlideClicked: () => {},
  onDuplicateSlideClicked: () => {},
  onDeleteSlideClicked: () => {},
  onBackToParentStemClicked: () => {},
  onCreateStemClicked: () => {}
};

describe('CreateNavigation', () => {
  it('renders the navigation actions and the slides droppable in SLIDES mode', () => {
    render(<CreateNavigation {...baseProps} />);
    expect(screen.getByTestId('actions-stub')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-stub')).toHaveTextContent('items:2');
  });

  it('renders the consent and summary static slides at the root stem', () => {
    render(<CreateNavigation {...baseProps} />);
    expect(screen.getByTestId('static-slide-CONSENT')).toBeInTheDocument();
    expect(screen.getByTestId('static-slide-SUMMARY')).toBeInTheDocument();
  });

  it('hides the consent slide and shows a Back to parent button when not at the root stem', async () => {
    const user = userEvent.setup();
    const onBackToParentStemClicked = vi.fn();

    render(
      <CreateNavigation
        {...baseProps}
        activeStem={{ isRoot: false }}
        onBackToParentStemClicked={onBackToParentStemClicked}
      />
    );

    expect(screen.queryByTestId('static-slide-CONSENT')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Back to parent/ }));
    expect(onBackToParentStemClicked).toHaveBeenCalledTimes(1);
  });

  it('hides the summary static slide when there are child stems', () => {
    render(<CreateNavigation {...baseProps} hasChildStems={true} />);
    expect(screen.queryByTestId('static-slide-SUMMARY')).not.toBeInTheDocument();
  });

  it('renders the placeholder copy in STEM navigation mode', () => {
    render(<CreateNavigation {...baseProps} navigationMode="STEM" />);
    expect(screen.getByText('Navigation settings coming soon...')).toBeInTheDocument();
    expect(screen.queryByTestId('droppable-stub')).not.toBeInTheDocument();
  });

  it('marks the consent slide as selected when activeSlideId is CONSENT', () => {
    render(<CreateNavigation {...baseProps} activeSlideId="CONSENT" />);
    expect(screen.getByTestId('static-slide-CONSENT')).toHaveTextContent(
      'Consent slide:true'
    );
  });
});
