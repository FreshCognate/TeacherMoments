import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('react-router', () => ({
  Link: ({ to, children }) => <a href={typeof to === 'string' ? to : ''}>{children}</a>
}));

vi.mock('../components/createNavigationActions', () => ({
  default: ({ onAddSlideClicked, isNestedStem }) => (
    <div data-testid={isNestedStem ? 'actions-stub-nested' : 'actions-stub-rail'}>
      <button onClick={onAddSlideClicked}>add slide</button>
    </div>
  )
}));

vi.mock('../components/createNavigationStaticSlide', () => ({
  default: ({ label, slideId, isSelected, isInRootStem }) => (
    <div data-testid={`static-slide-${slideId}`} data-in-root-stem={String(isInRootStem)}>
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
    <div data-testid="droppable-stub">items:{items.map((item) => item._id).join(',')}</div>
  )
}));

vi.mock('~/modules/flags/components/flag', () => ({
  default: ({ children }) => <>{children}</>
}));

vi.mock('~/uikit/icons/components/icon', () => ({
  default: ({ icon }) => <span data-testid={`icon-${icon}`} />
}));

vi.mock('~/modules/triggers/helpers/getTriggersBySlideRef', () => ({
  default: () => []
}));

vi.mock('~/modules/stems/helpers/getStemsBySlideRef', () => ({
  default: () => false
}));

import CreateNavigation from '../components/createNavigation';

const baseProps = {
  scenarioId: 'scenario-1',
  slides: [{ _id: 'slide-1', ref: 'slide-ref-1' }, { _id: 'slide-2', ref: 'slide-ref-2' }],
  blocks: [],
  rootSlides: [{ _id: 'root-1', ref: 'root-ref-1' }, { _id: 'root-2', ref: 'root-ref-2' }],
  activeSlideId: 'slide-1',
  activeStemSlideId: 'stem-slide-1',
  activeStem: { slideRef: 'stem-slide-ref-1' },
  isCreating: false,
  deletingId: null,
  isDuplicating: false,
  isInRootStem: true,
  onAddSlideClicked: () => {},
  onDuplicateSlideClicked: () => {},
  onDeleteSlideClicked: () => {},
  onCreateStemClicked: () => {}
};

describe('CreateNavigation', () => {
  describe('when in the root stem', () => {
    it('renders actions, the consent and summary static slides, and the slides droppable', () => {
      render(<CreateNavigation {...baseProps} />);
      expect(screen.getByTestId('actions-stub-rail')).toBeInTheDocument();
      expect(screen.getByTestId('static-slide-CONSENT')).toBeInTheDocument();
      expect(screen.getByTestId('static-slide-SUMMARY')).toBeInTheDocument();
      expect(screen.getByTestId('droppable-stub')).toHaveTextContent('items:root-1,root-2');
    });

    it('does not render the nested stem panel', () => {
      render(<CreateNavigation {...baseProps} />);
      expect(screen.queryByTestId('actions-stub-nested')).not.toBeInTheDocument();
    });

    it('marks the consent static slide as selected when activeSlideId is CONSENT', () => {
      render(<CreateNavigation {...baseProps} activeSlideId="CONSENT" />);
      expect(screen.getByTestId('static-slide-CONSENT')).toHaveTextContent('Consent:true');
      expect(screen.getByTestId('static-slide-SUMMARY')).toHaveTextContent('Summary:false');
    });

    it('marks the summary static slide as selected when activeSlideId is SUMMARY', () => {
      render(<CreateNavigation {...baseProps} activeSlideId="SUMMARY" />);
      expect(screen.getByTestId('static-slide-SUMMARY')).toHaveTextContent('Summary:true');
      expect(screen.getByTestId('static-slide-CONSENT')).toHaveTextContent('Consent:false');
    });

    it('calls onAddSlideClicked when the actions add button is clicked', async () => {
      const user = userEvent.setup();
      const onAddSlideClicked = vi.fn();
      render(<CreateNavigation {...baseProps} onAddSlideClicked={onAddSlideClicked} />);
      await user.click(screen.getByRole('button', { name: /add slide/ }));
      expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
    });
  });

  describe('when not in the root stem', () => {
    const nestedProps = { ...baseProps, isInRootStem: false };

    it('renders the left rail with collapsed static slides and the root slides droppable', () => {
      render(<CreateNavigation {...nestedProps} />);
      expect(screen.getByTestId('static-slide-CONSENT')).toHaveAttribute('data-in-root-stem', 'false');
      expect(screen.getByTestId('static-slide-SUMMARY')).toHaveAttribute('data-in-root-stem', 'false');

      const droppables = screen.getAllByTestId('droppable-stub');
      expect(droppables[0]).toHaveTextContent('items:root-1,root-2');
    });

    it('renders the nested panel actions and the nested stem slides droppable', () => {
      render(<CreateNavigation {...nestedProps} />);
      expect(screen.getByTestId('actions-stub-rail')).toBeInTheDocument();
      expect(screen.getByTestId('actions-stub-nested')).toBeInTheDocument();

      const droppables = screen.getAllByTestId('droppable-stub');
      expect(droppables[1]).toHaveTextContent('items:slide-1,slide-2');
    });

    it('calls onAddSlideClicked when the nested-panel add button is clicked', async () => {
      const user = userEvent.setup();
      const onAddSlideClicked = vi.fn();
      render(<CreateNavigation {...nestedProps} onAddSlideClicked={onAddSlideClicked} />);
      const nestedActions = screen.getByTestId('actions-stub-nested');
      await user.click(within(nestedActions).getByRole('button', { name: /add slide/ }));
      expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
    });
  });
});
