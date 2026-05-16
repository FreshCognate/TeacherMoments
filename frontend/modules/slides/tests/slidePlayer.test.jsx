import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const getBlockTrackingMock = vi.fn();
const getBlockComponentMock = vi.fn();
const getSlideFeedbackItemsMock = vi.fn();
const getSlideStatusMock = vi.fn();

vi.mock('~/modules/run/helpers/getBlockTracking', () => ({ default: (args) => getBlockTrackingMock(args) }));
vi.mock('~/modules/blocks/helpers/getBlockComponent', () => ({ default: (args) => getBlockComponentMock(args) }));
vi.mock('~/modules/run/helpers/getSlideFeedbackItems', () => ({ default: () => getSlideFeedbackItemsMock() }));
vi.mock('~/modules/run/helpers/getSlideStatus', () => ({ default: () => getSlideStatusMock() }));

vi.mock('../components/consentSlide', () => ({
  default: () => <div data-testid="consent-slide-stub" />
}));

vi.mock('../components/summarySlide', () => ({
  default: () => <div data-testid="summary-slide-stub" />
}));

vi.mock('../components/slidePlayerHeader', () => ({
  default: ({ activeSlide }) => <div data-testid="header-stub">{activeSlide.name}</div>
}));

vi.mock('../components/slidePlayerNavigation', () => ({
  default: () => <div data-testid="navigation-stub" />
}));

import SlidePlayer from '../components/slidePlayer';

const baseProps = {
  scenario: { _id: 'scenario-1' },
  activeSlide: { _id: 'slide-1', ref: 'slide-1', name: 'Intro', slideType: 'CONTENT' },
  activeBlocks: [],
  navigateTo: vi.fn(),
  run: {},
  isLoading: false,
  isMenuOpen: false,
  primaryAction: null,
  secondaryAction: null,
  onActionClicked: vi.fn(),
  onUpdateBlockTracking: vi.fn(),
  onMenuClicked: vi.fn(),
  onMenuActionClicked: vi.fn()
};

describe('SlidePlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSlideFeedbackItemsMock.mockReturnValue([]);
    getSlideStatusMock.mockReturnValue(null);
    getBlockTrackingMock.mockReturnValue({ isHidden: false });
  });

  it('renders a Loading state when isLoading is true', () => {
    const { container } = render(<SlidePlayer {...baseProps} isLoading={true} />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
    expect(screen.queryByTestId('header-stub')).not.toBeInTheDocument();
  });

  it('renders a Loading state when there is no activeSlide', () => {
    const { container } = render(<SlidePlayer {...baseProps} activeSlide={null} />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders the consent slide when slideType is CONSENT', () => {
    render(
      <SlidePlayer
        {...baseProps}
        activeSlide={{ _id: 'c1', ref: 'c1', name: 'Consent', slideType: 'CONSENT' }}
      />
    );
    expect(screen.getByTestId('consent-slide-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-slide-stub')).not.toBeInTheDocument();
  });

  it('renders the summary slide when slideType is SUMMARY', () => {
    render(
      <SlidePlayer
        {...baseProps}
        activeSlide={{ _id: 's1', ref: 's1', name: 'Summary', slideType: 'SUMMARY' }}
      />
    );
    expect(screen.getByTestId('summary-slide-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('consent-slide-stub')).not.toBeInTheDocument();
  });

  it('renders an "unsupported" message when no block component is registered', () => {
    getBlockComponentMock.mockReturnValue(null);
    render(
      <SlidePlayer
        {...baseProps}
        activeBlocks={[{ _id: 'b1', ref: 'b1', blockType: 'UNKNOWN' }]}
      />
    );
    expect(screen.getByText('Block is unsupported')).toBeInTheDocument();
  });

  it('renders the registered block component for known block types', () => {
    const FakeBlock = ({ block }) => <div data-testid="fake-block">{block.ref}</div>;
    getBlockComponentMock.mockReturnValue(FakeBlock);

    render(
      <SlidePlayer
        {...baseProps}
        activeBlocks={[{ _id: 'b1', ref: 'block-1', blockType: 'TEXT' }]}
      />
    );

    expect(screen.getByTestId('fake-block')).toHaveTextContent('block-1');
  });

  it('does not render blocks that are marked hidden by tracking', () => {
    const FakeBlock = ({ block }) => <div data-testid="fake-block">{block.ref}</div>;
    getBlockComponentMock.mockReturnValue(FakeBlock);
    getBlockTrackingMock
      .mockReturnValueOnce({ isHidden: true })
      .mockReturnValueOnce({ isHidden: false });

    render(
      <SlidePlayer
        {...baseProps}
        activeBlocks={[
          { _id: 'b1', ref: 'block-1', blockType: 'TEXT' },
          { _id: 'b2', ref: 'block-2', blockType: 'TEXT' }
        ]}
      />
    );

    const visibleBlocks = screen.getAllByTestId('fake-block');
    expect(visibleBlocks).toHaveLength(1);
    expect(visibleBlocks[0]).toHaveTextContent('block-2');
  });

  it('skips block tracking on CONSENT slides', () => {
    const FakeBlock = ({ blockTracking }) => (
      <div data-testid="fake-block" data-tracking={JSON.stringify(blockTracking)} />
    );
    getBlockComponentMock.mockReturnValue(FakeBlock);

    render(
      <SlidePlayer
        {...baseProps}
        activeSlide={{ _id: 'c1', ref: 'c1', name: 'Consent', slideType: 'CONSENT' }}
        activeBlocks={[{ _id: 'b1', ref: 'block-1', blockType: 'TEXT' }]}
      />
    );

    expect(getBlockTrackingMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('fake-block')).toHaveAttribute('data-tracking', '{}');
  });

  it('renders feedback items when present', () => {
    getSlideFeedbackItemsMock.mockReturnValue(['Great answer!', 'Try again next time.']);
    render(<SlidePlayer {...baseProps} />);
    expect(screen.getByText('Feedback Based on Your Response')).toBeInTheDocument();
  });

  it('does not render the feedback section when there are no feedback items', () => {
    getSlideFeedbackItemsMock.mockReturnValue([]);
    render(<SlidePlayer {...baseProps} />);
    expect(screen.queryByText('Feedback Based on Your Response')).not.toBeInTheDocument();
  });

  it('renders a slide-status loader when getSlideStatus returns a string', () => {
    getSlideStatusMock.mockReturnValue('Generating feedback...');
    render(<SlidePlayer {...baseProps} />);
    expect(screen.getByText('Generating feedback...')).toBeInTheDocument();
  });
});
