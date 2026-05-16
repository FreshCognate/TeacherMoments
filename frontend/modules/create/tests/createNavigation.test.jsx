import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('react-router', () => ({
  Link: ({ to, children }) => <a href={typeof to === 'string' ? to : ''}>{children}</a>
}));

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
  rootSlides: [{ _id: 'root-1' }, { _id: 'root-2' }],
  activeSlideId: 'slide-1',
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
      expect(screen.getByTestId('actions-stub')).toBeInTheDocument();
      expect(screen.getByTestId('static-slide-CONSENT')).toBeInTheDocument();
      expect(screen.getByTestId('static-slide-SUMMARY')).toBeInTheDocument();
      expect(screen.getByTestId('droppable-stub')).toHaveTextContent('items:2');
    });

    it('does not render the root-stem link rail', () => {
      render(<CreateNavigation {...baseProps} />);
      expect(screen.queryByTestId('icon-consent')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-summary')).not.toBeInTheDocument();
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

    it('renders the root-stem link rail with consent, each root slide, and summary', () => {
      render(<CreateNavigation {...nestedProps} />);
      const consentLink = screen.getByTestId('icon-consent').closest('a');
      const summaryLink = screen.getByTestId('icon-summary').closest('a');
      expect(consentLink).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=CONSENT');
      expect(summaryLink).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=SUMMARY');

      const slideIcons = screen.getAllByTestId('icon-slides');
      expect(slideIcons).toHaveLength(2);
      expect(slideIcons[0].closest('a')).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=root-1');
      expect(slideIcons[1].closest('a')).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=root-2');
    });

    it('renders actions and the slides droppable wrapped in the HAS_STEMS flag', () => {
      render(<CreateNavigation {...nestedProps} />);
      expect(screen.getByTestId('actions-stub')).toBeInTheDocument();
      expect(screen.getByTestId('droppable-stub')).toHaveTextContent('items:2');
    });

    it('does not render the consent or summary static slides', () => {
      render(<CreateNavigation {...nestedProps} />);
      expect(screen.queryByTestId('static-slide-CONSENT')).not.toBeInTheDocument();
      expect(screen.queryByTestId('static-slide-SUMMARY')).not.toBeInTheDocument();
    });

    it('calls onAddSlideClicked when the actions add button is clicked', async () => {
      const user = userEvent.setup();
      const onAddSlideClicked = vi.fn();
      render(<CreateNavigation {...nestedProps} onAddSlideClicked={onAddSlideClicked} />);
      await user.click(screen.getByRole('button', { name: /add slide/ }));
      expect(onAddSlideClicked).toHaveBeenCalledTimes(1);
    });
  });
});
