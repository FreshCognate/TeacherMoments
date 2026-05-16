import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

vi.mock('../containers/createNavigationSlideActionsContainer', () => ({
  default: ({ slideNumber, onDuplicateSlideClicked, onDeleteSlideClicked }) => (
    <div data-testid="actions-stub">
      <span>slide:{slideNumber}</span>
      <button onClick={onDuplicateSlideClicked}>duplicate</button>
      <button onClick={onDeleteSlideClicked}>delete</button>
    </div>
  )
}));

vi.mock('../containers/createStemsContainer', () => ({
  default: () => <div data-testid="stems-stub">stems</div>
}));

vi.mock('~/modules/flags/components/flag', () => ({
  default: ({ children }) => <>{children}</>
}));

vi.mock('~/modules/blocks/helpers/getBlockComponent', () => ({
  default: () => () => <div data-testid="block-stub">block</div>
}));

import CreateNavigationSlide from '../components/createNavigationSlide';

const slide = { _id: 'slide-1', ref: 'ref-1', sortOrder: 2 };

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

const baseProps = {
  scenarioId: 'scenario-1',
  slide,
  slideBlocks: [{ _id: 'block-1', blockType: 'TEXT' }],
  slideTriggers: [],
  isSelected: false,
  isDeleting: false,
  isDuplicating: false,
  canDeleteSlides: true,
  onDuplicateSlideClicked: () => {},
  onDeleteSlideClicked: () => {}
};

describe('CreateNavigationSlide', () => {
  it('renders the actions container with the 1-based slide number', () => {
    renderInRouter(<CreateNavigationSlide {...baseProps} />);
    expect(screen.getByText('slide:3')).toBeInTheDocument();
  });

  it('links to the create route with the slide id as a query parameter', () => {
    renderInRouter(<CreateNavigationSlide {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/scenarios/scenario-1/create?slide=slide-1');
  });

  it('renders one block component per slide block', () => {
    renderInRouter(
      <CreateNavigationSlide
        {...baseProps}
        slideBlocks={[
          { _id: 'block-1', blockType: 'TEXT' },
          { _id: 'block-2', blockType: 'IMAGES' }
        ]}
      />
    );
    expect(screen.getAllByTestId('block-stub')).toHaveLength(2);
  });

  it('fires onDuplicateSlideClicked with the slide id when triggered', async () => {
    const user = userEvent.setup();
    const onDuplicateSlideClicked = vi.fn();

    renderInRouter(
      <CreateNavigationSlide
        {...baseProps}
        onDuplicateSlideClicked={onDuplicateSlideClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'duplicate' }));

    expect(onDuplicateSlideClicked).toHaveBeenCalledWith('slide-1');
  });

  it('fires onDeleteSlideClicked with the slide id when triggered', async () => {
    const user = userEvent.setup();
    const onDeleteSlideClicked = vi.fn();

    renderInRouter(
      <CreateNavigationSlide
        {...baseProps}
        onDeleteSlideClicked={onDeleteSlideClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'delete' }));

    expect(onDeleteSlideClicked).toHaveBeenCalledWith('slide-1');
  });

  it('applies the selected outline class when isSelected is true', () => {
    const { container } = renderInRouter(
      <CreateNavigationSlide {...baseProps} isSelected={true} />
    );
    expect(container.querySelector('.outline.outline-blue-500')).toBeInTheDocument();
  });

  it('applies an opacity class when isDeleting, isDragging, or isDuplicating is true', () => {
    const { container } = renderInRouter(
      <CreateNavigationSlide {...baseProps} isDuplicating={true} />
    );
    expect(container.querySelector('.opacity-50')).toBeInTheDocument();
  });
});
