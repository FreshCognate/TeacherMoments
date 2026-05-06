import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('~/modules/blocks/containers/blocksEditorContainer', () => ({
  default: ({ slideId }) => <div data-testid="blocks-editor-stub">blocks:{slideId}</div>
}));
vi.mock('../containers/createWorkspaceToolbarContainer', () => ({
  default: () => <div data-testid="toolbar-stub">toolbar</div>
}));
vi.mock('../containers/createStaticSlideEditorContainer', () => ({
  default: ({ type }) => <div data-testid="static-editor-stub">static:{type}</div>
}));
vi.mock('~/modules/scenarios/containers/playScenarioContainer', () => ({
  default: () => <div data-testid="play-scenario-stub">play scenario</div>
}));

import CreateWorkspace from '../components/createWorkspace';

const baseProps = {
  activeSlideId: 'slide-1',
  displayMode: 'EDITING',
  navigationMode: 'SLIDES',
  isStaticSlide: false
};

describe('CreateWorkspace', () => {
  it('always renders the toolbar', () => {
    render(<CreateWorkspace {...baseProps} />);
    expect(screen.getByTestId('toolbar-stub')).toBeInTheDocument();
  });

  it('renders the blocks editor for a non-static slide in EDITING mode', () => {
    render(<CreateWorkspace {...baseProps} />);
    expect(screen.getByTestId('blocks-editor-stub')).toHaveTextContent('blocks:slide-1');
    expect(screen.queryByTestId('static-editor-stub')).not.toBeInTheDocument();
  });

  it('renders the static slide editor for a static slide in EDITING mode', () => {
    render(
      <CreateWorkspace
        {...baseProps}
        isStaticSlide={true}
        activeSlideId="CONSENT"
      />
    );
    expect(screen.getByTestId('static-editor-stub')).toHaveTextContent('static:CONSENT');
    expect(screen.queryByTestId('blocks-editor-stub')).not.toBeInTheDocument();
  });

  it('renders the play scenario container in PREVIEW mode', () => {
    render(<CreateWorkspace {...baseProps} displayMode="PREVIEW" />);
    expect(screen.getByTestId('play-scenario-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('blocks-editor-stub')).not.toBeInTheDocument();
  });

  it('renders the navigation-settings placeholder when navigationMode is STEM', () => {
    render(<CreateWorkspace {...baseProps} navigationMode="STEM" />);
    expect(screen.getByText('Navigation settings coming soon...')).toBeInTheDocument();
    expect(screen.queryByTestId('blocks-editor-stub')).not.toBeInTheDocument();
  });
});
