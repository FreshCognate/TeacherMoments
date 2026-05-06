import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

const axiosPutMock = vi.fn();
vi.mock('axios', () => ({
  default: { put: (...args) => axiosPutMock(...args) }
}));

const handleRequestErrorMock = vi.fn();
vi.mock('~/core/app/helpers/handleRequestError', () => ({
  default: (err) => handleRequestErrorMock(err)
}));

const getCacheMock = vi.fn();
vi.mock('~/core/cache/helpers/getCache', () => ({
  default: (key) => getCacheMock(key)
}));

const getTriggerMock = vi.fn();
vi.mock('../helpers/getTrigger', () => ({
  default: (action) => getTriggerMock(action)
}));

vi.mock('../schemas/getEditTriggerSchema', () => ({
  default: () => ({ baseField: { type: 'Text' } })
}));

let capturedProps = null;
vi.mock('../components/triggerItem', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="trigger-item-stub" />;
  }
}));

import TriggerItemContainer from '../containers/triggerItemContainer';

const buildProps = (overrides = {}) => ({
  trigger: { _id: 'trigger-1', action: 'SHOW_FEEDBACK_FROM_PROMPTS' },
  isLastTrigger: false,
  onDeleteTriggerClicked: vi.fn(),
  onSortUpClicked: vi.fn(),
  onSortDownClicked: vi.fn(),
  ...overrides
});

describe('TriggerItemContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    vi.clearAllMocks();
    getTriggerMock.mockReturnValue({
      getSchema: () => ({ extraField: { type: 'Text' } })
    });
  });

  it('combines the base schema and the registered trigger schema', () => {
    render(<TriggerItemContainer {...buildProps()} />);
    expect(capturedProps.schema).toEqual({
      baseField: { type: 'Text' },
      extraField: { type: 'Text' }
    });
  });

  it('toggles the actions menu open state', () => {
    render(<TriggerItemContainer {...buildProps()} />);
    expect(capturedProps.isOptionsOpen).toBe(false);

    act(() => capturedProps.onToggleActionsClicked(true));
    expect(capturedProps.isOptionsOpen).toBe(true);

    act(() => capturedProps.onToggleActionsClicked(false));
    expect(capturedProps.isOptionsOpen).toBe(false);
  });

  it('closes the actions menu and triggers delete when DELETE is clicked', () => {
    const onDeleteTriggerClicked = vi.fn();
    render(<TriggerItemContainer {...buildProps({ onDeleteTriggerClicked })} />);

    act(() => capturedProps.onToggleActionsClicked(true));
    act(() => capturedProps.onActionClicked('DELETE'));

    expect(capturedProps.isOptionsOpen).toBe(false);
    expect(onDeleteTriggerClicked).toHaveBeenCalledWith('trigger-1');
  });

  it('closes the actions menu without delete for unknown actions', () => {
    const onDeleteTriggerClicked = vi.fn();
    render(<TriggerItemContainer {...buildProps({ onDeleteTriggerClicked })} />);

    act(() => capturedProps.onToggleActionsClicked(true));
    act(() => capturedProps.onActionClicked('SOMETHING_ELSE'));

    expect(capturedProps.isOptionsOpen).toBe(false);
    expect(onDeleteTriggerClicked).not.toHaveBeenCalled();
  });

  it('optimistically updates the cache and PUTs to /api/triggers when the form changes', () => {
    const triggersCache = { set: vi.fn(), fetch: vi.fn() };
    getCacheMock.mockReturnValue(triggersCache);
    axiosPutMock.mockResolvedValue({});

    render(<TriggerItemContainer {...buildProps()} />);
    capturedProps.onFormUpdate({ update: { foo: 'bar' } });

    expect(triggersCache.set).toHaveBeenCalledWith(
      { foo: 'bar' },
      { setType: 'itemExtend', setFind: { _id: 'trigger-1' } }
    );
    expect(axiosPutMock).toHaveBeenCalledWith('/api/triggers/trigger-1', { foo: 'bar' });
  });

  it('refetches the triggers cache after a successful PUT', async () => {
    const triggersCache = { set: vi.fn(), fetch: vi.fn() };
    getCacheMock.mockReturnValue(triggersCache);
    axiosPutMock.mockResolvedValue({});

    render(<TriggerItemContainer {...buildProps()} />);
    capturedProps.onFormUpdate({ update: { foo: 'bar' } });

    await new Promise((r) => setTimeout(r, 0));
    expect(triggersCache.fetch).toHaveBeenCalled();
  });

  it('forwards errors from the PUT request to handleRequestError', async () => {
    const triggersCache = { set: vi.fn(), fetch: vi.fn() };
    getCacheMock.mockReturnValue(triggersCache);
    const error = new Error('boom');
    axiosPutMock.mockRejectedValue(error);

    render(<TriggerItemContainer {...buildProps()} />);
    capturedProps.onFormUpdate({ update: { foo: 'bar' } });

    await new Promise((r) => setTimeout(r, 0));
    expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
  });
});
