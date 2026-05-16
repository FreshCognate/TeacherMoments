import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

vi.mock('~/core/forms/helpers/registerField', () => ({
  default: (_, Component) => Component
}));

let capturedProps = null;
vi.mock('../components/slideNavigation.formField', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="slide-navigation-stub" />;
  }
}));

import SlideNavigationContainer from '../containers/slideNavigationContainer.formField';

const buildProps = (overrides = {}) => ({
  value: 'navigateToNext',
  schema: {
    options: [
      { value: 'navigateToNext', text: 'Next' },
      { value: 'navigateToEnd', text: 'End' }
    ]
  },
  updateField: vi.fn(),
  ...overrides
});

describe('SlideNavigationContainerFormField', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('starts with isEditing false', () => {
    render(<SlideNavigationContainer {...buildProps()} />);
    expect(capturedProps.isEditing).toBe(false);
  });

  it('sets isEditing true when edit is clicked', () => {
    render(<SlideNavigationContainer {...buildProps()} />);
    act(() => capturedProps.onEditClicked());
    expect(capturedProps.isEditing).toBe(true);
  });

  it('clears isEditing and forwards the new value when an option is selected', () => {
    const updateField = vi.fn();
    render(<SlideNavigationContainer {...buildProps({ updateField })} />);

    act(() => capturedProps.onEditClicked());
    expect(capturedProps.isEditing).toBe(true);

    act(() => capturedProps.onNavigationOptionClicked('navigateToEnd'));
    expect(capturedProps.isEditing).toBe(false);
    expect(updateField).toHaveBeenCalledWith('navigateToEnd');
  });
});
