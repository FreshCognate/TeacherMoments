import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../containers/createNavigationContainer', () => ({
  default: () => <div data-testid="navigation-stub">navigation</div>
}));
vi.mock('../containers/createWorkspaceContainer', () => ({
  default: () => <div data-testid="workspace-stub">workspace</div>
}));

import Create from '../components/create';

describe('Create', () => {
  it('renders the navigation and workspace containers inside a DndContext', () => {
    render(
      <Create
        onDragStart={() => {}}
        onDragEnd={() => {}}
        onDragOver={() => {}}
      />
    );

    expect(screen.getByTestId('navigation-stub')).toBeInTheDocument();
    expect(screen.getByTestId('workspace-stub')).toBeInTheDocument();
  });
});
