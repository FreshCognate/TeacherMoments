import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SlideActions from '../components/slideActions';

const renderActions = (slide: any, doesSlideContainPrompts = true) => render(
  <SlideActions
    slide={slide}
    doesSlideContainPrompts={doesSlideContainPrompts}
    onToggleFeedbackClicked={vi.fn()}
    onEditFeedbackClicked={vi.fn()}
  />
);

describe('SlideActions', () => {
  it('renders nothing when the slide has no prompts', () => {
    const { container } = renderActions({ hasFeedback: false, feedbackItems: [] }, false);
    expect(container).toBeEmptyDOMElement();
  });

  it('asks about feedback when it is off', () => {
    renderActions({ hasFeedback: false, feedbackItems: [] });
    expect(screen.getByText('Give participants feedback on their answer?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turn on feedback' })).toBeInTheDocument();
  });

  it('says "1 item" for one feedback item', () => {
    renderActions({ hasFeedback: true, feedbackItems: [{}] });
    expect(screen.getByText('Feedback is on: 1 item.')).toBeInTheDocument();
  });

  it('says "items" for more than one feedback item', () => {
    renderActions({ hasFeedback: true, feedbackItems: [{}, {}] });
    expect(screen.getByText('Feedback is on: 2 items.')).toBeInTheDocument();
  });
});
