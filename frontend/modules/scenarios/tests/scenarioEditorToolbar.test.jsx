import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScenarioEditorToolbar from '../components/scenarioEditorToolbar';

describe('ScenarioEditorToolbar', () => {
  it('renders the Edit and Preview toggle buttons', () => {
    render(
      <ScenarioEditorToolbar
        displayMode="EDITING"
        onDisplayModeChanged={() => {}}
        onAddBlockClicked={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
  });

  it('fires onDisplayModeChanged with PREVIEW when the Preview toggle is clicked', async () => {
    const user = userEvent.setup();
    const onDisplayModeChanged = vi.fn();

    render(
      <ScenarioEditorToolbar
        displayMode="EDITING"
        onDisplayModeChanged={onDisplayModeChanged}
        onAddBlockClicked={() => {}}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Preview' }));

    expect(onDisplayModeChanged).toHaveBeenCalledWith('PREVIEW');
  });
});
