import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

vi.mock('~/core/forms/helpers/registerField', () => ({
  default: () => () => {}
}));

let capturedProps = null;
vi.mock('../components/slideRefSelector.formField', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="slide-ref-selector-stub" />;
  }
}));

import SlideRefSelectorContainer from '../containers/slideRefSelectorContainer.formField';

const buildProps = (overrides = {}) => ({
  value: 'slide-1',
  slides: {
    data: [
      { ref: 'slide-1', name: 'Intro' },
      { ref: 'slide-2', name: 'Middle' },
      { ref: 'slide-3', name: 'Conclusion' }
    ]
  },
  block: { data: { slideRef: 'slide-1' } },
  updateField: vi.fn(),
  ...overrides
});

describe('SlideRefSelectorContainer', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  describe('options', () => {
    it('excludes the current slide ref from the options list', () => {
      render(<SlideRefSelectorContainer {...buildProps()} />);
      const refs = capturedProps.options.map((opt) => opt.value);
      expect(refs).not.toContain('slide-1');
      expect(refs).toEqual(['slide-2', 'slide-3']);
    });

    it('filters options by the current search value (case-insensitive)', () => {
      render(<SlideRefSelectorContainer {...buildProps()} />);
      act(() => {
        capturedProps.onSearchInputChanged({ target: { value: 'CONC' } });
      });
      expect(capturedProps.options.map((opt) => opt.value)).toEqual(['slide-3']);
    });
  });

  describe('selected value', () => {
    it('returns the matched slide name when value matches a slide ref', () => {
      render(<SlideRefSelectorContainer {...buildProps({ value: 'slide-2' })} />);
      expect(capturedProps.selectedSlideName).toBe('Middle');
      expect(capturedProps.selectedSlideRef).toBe('slide-2');
    });

    it('passes undefined name when value does not match any slide', () => {
      render(<SlideRefSelectorContainer {...buildProps({ value: 'unknown-slide' })} />);
      expect(capturedProps.selectedSlideName).toBeUndefined();
      expect(capturedProps.selectedSlideRef).toBeUndefined();
    });
  });

  describe('interactions', () => {
    it('toggles the dropdown open state', () => {
      render(<SlideRefSelectorContainer {...buildProps()} />);
      expect(capturedProps.isDropdownOpen).toBe(false);

      act(() => capturedProps.onToggleDropdown(true));
      expect(capturedProps.isDropdownOpen).toBe(true);

      act(() => capturedProps.onToggleDropdown(false));
      expect(capturedProps.isDropdownOpen).toBe(false);
    });

    it('closes the dropdown and updates the field when a slide is selected', () => {
      const updateField = vi.fn();
      render(<SlideRefSelectorContainer {...buildProps({ updateField })} />);

      act(() => capturedProps.onToggleDropdown(true));
      act(() => capturedProps.onSlideSelected('slide-2'));

      expect(updateField).toHaveBeenCalledWith('slide-2');
      expect(capturedProps.isDropdownOpen).toBe(false);
    });
  });
});
