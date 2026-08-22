import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

const getStemsBySlideRefMock = vi.fn();
vi.mock('~/modules/stems/helpers/getStemsBySlideRef', () => ({
  default: (args) => getStemsBySlideRefMock(args)
}));

const getPromptBlocksBySlideRefMock = vi.fn();
vi.mock('~/modules/blocks/helpers/getPromptBlocksBySlideRef', () => ({
  default: (args) => getPromptBlocksBySlideRefMock(args)
}));

vi.mock('~/core/dialogs/helpers/addModal', () => ({
  default: vi.fn()
}));

let capturedProps = null;
vi.mock('../components/triggerStems.formField', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="trigger-stems-stub" />;
  }
}));

import Fields from '~/core/forms/forms.fields';
import '../containers/triggerStemsContainer.formField';

const TriggerStemsContainer = Fields.TriggerStems;

const renderContainer = (value) => {
  const updateField = vi.fn();
  render(
    <TriggerStemsContainer
      model={{ elementRef: 'slide-1' }}
      value={value}
      updateField={updateField}
    />
  );
  return updateField;
};

describe('TriggerStemsContainer default stem', () => {

  beforeEach(() => {
    capturedProps = null;
    getStemsBySlideRefMock.mockReturnValue([
      { _id: 's1', ref: 'stem-1', name: 'Stem 1' },
      { _id: 's2', ref: 'stem-2', name: 'Stem 2' }
    ]);
    getPromptBlocksBySlideRefMock.mockReturnValue([]);
  });

  it('reports the item with no conditions as the default stem', () => {
    renderContainer([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] },
      { elementRef: 'stem-2', conditions: [] }
    ]);

    expect(capturedProps.defaultStemRef).toBe('stem-2');
  });

  it('reports no default when every item has conditions', () => {
    renderContainer([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] }
    ]);

    expect(capturedProps.defaultStemRef).toBe('');
  });

  it('adds an item with no conditions when the chosen stem has none yet', () => {
    const updateField = renderContainer([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] }
    ]);

    capturedProps.onDefaultStemChanged('stem-2');

    expect(updateField).toHaveBeenCalledWith([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] },
      { elementRef: 'stem-2', conditions: [] }
    ]);
  });

  it('clears the conditions of a stem that is promoted to the default', () => {
    const updateField = renderContainer([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] },
      { elementRef: 'stem-2', conditions: [{ _id: 'c2' }] }
    ]);

    capturedProps.onDefaultStemChanged('stem-2');

    expect(updateField).toHaveBeenCalledWith([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] },
      { elementRef: 'stem-2', conditions: [] }
    ]);
  });

  it('drops the previous default when the default moves to another stem', () => {
    const updateField = renderContainer([
      { elementRef: 'stem-1', conditions: [] },
      { elementRef: 'stem-2', conditions: [{ _id: 'c2' }] }
    ]);

    capturedProps.onDefaultStemChanged('stem-2');

    expect(updateField).toHaveBeenCalledWith([
      { elementRef: 'stem-2', conditions: [] }
    ]);
  });

  it('removes the default entirely when None is selected', () => {
    const updateField = renderContainer([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] },
      { elementRef: 'stem-2', conditions: [] }
    ]);

    capturedProps.onDefaultStemChanged('');

    expect(updateField).toHaveBeenCalledWith([
      { elementRef: 'stem-1', conditions: [{ _id: 'c1' }] }
    ]);
  });

  it('does nothing when the chosen stem is already the default', () => {
    const updateField = renderContainer([
      { elementRef: 'stem-1', conditions: [] }
    ]);

    capturedProps.onDefaultStemChanged('stem-1');

    expect(updateField).not.toHaveBeenCalled();
  });

  it('does not mutate the value it was given', () => {
    const value = [{ elementRef: 'stem-1', conditions: [{ _id: 'c1' }] }];
    renderContainer(value);

    capturedProps.onDefaultStemChanged('stem-1');

    expect(value).toEqual([{ elementRef: 'stem-1', conditions: [{ _id: 'c1' }] }]);
  });

});
