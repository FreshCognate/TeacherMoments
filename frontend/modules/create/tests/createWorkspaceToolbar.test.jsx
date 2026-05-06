import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateWorkspaceToolbar from '../components/createWorkspaceToolbar';

const baseProps = {
  slide: { _id: 'slide-1', name: 'Intro' },
  displayMode: 'EDITING',
  isStaticSlide: false,
  onDisplayModeChanged: () => {},
  onAddBlockClicked: () => {},
  onSlideNameChanged: () => {}
};

describe('CreateWorkspaceToolbar', () => {
  it('renders the slide title input pre-populated with the slide name', () => {
    render(<CreateWorkspaceToolbar {...baseProps} />);
    expect(screen.getByPlaceholderText('Slide title')).toHaveValue('Intro');
  });

  it('renders the Add block button when not a static slide', () => {
    render(<CreateWorkspaceToolbar {...baseProps} />);
    expect(screen.getByRole('button', { name: /Add block/ })).toBeInTheDocument();
  });

  it('hides the slide title input and Add block button when isStaticSlide is true', () => {
    render(<CreateWorkspaceToolbar {...baseProps} isStaticSlide={true} />);
    expect(screen.queryByPlaceholderText('Slide title')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add block/ })).not.toBeInTheDocument();
  });

  it('fires onSlideNameChanged when typing in the slide title input', async () => {
    const user = userEvent.setup();
    const onSlideNameChanged = vi.fn();

    render(<CreateWorkspaceToolbar {...baseProps} onSlideNameChanged={onSlideNameChanged} />);
    await user.type(screen.getByPlaceholderText('Slide title'), 'X');

    expect(onSlideNameChanged).toHaveBeenCalled();
  });

  it('fires onAddBlockClicked when the Add block button is clicked', async () => {
    const user = userEvent.setup();
    const onAddBlockClicked = vi.fn();

    render(<CreateWorkspaceToolbar {...baseProps} onAddBlockClicked={onAddBlockClicked} />);
    await user.click(screen.getByRole('button', { name: /Add block/ }));

    expect(onAddBlockClicked).toHaveBeenCalledTimes(1);
  });

  it('fires onDisplayModeChanged with PREVIEW when the Preview toggle is clicked', async () => {
    const user = userEvent.setup();
    const onDisplayModeChanged = vi.fn();

    render(<CreateWorkspaceToolbar {...baseProps} onDisplayModeChanged={onDisplayModeChanged} />);
    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(onDisplayModeChanged).toHaveBeenCalledWith('PREVIEW');
  });
});
