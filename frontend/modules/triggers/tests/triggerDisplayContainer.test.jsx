import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component) => Component
}));

const axiosPostMock = vi.fn();
const axiosPutMock = vi.fn();
const axiosDeleteMock = vi.fn();
vi.mock('axios', () => ({
  default: {
    post: (...args) => axiosPostMock(...args),
    put: (...args) => axiosPutMock(...args),
    delete: (...args) => axiosDeleteMock(...args)
  }
}));

const handleRequestErrorMock = vi.fn();
vi.mock('~/core/app/helpers/handleRequestError', () => ({
  default: (err) => handleRequestErrorMock(err)
}));

const addModalMock = vi.fn();
vi.mock('~/core/dialogs/helpers/addModal', () => ({
  default: (config, callback) => addModalMock(config, callback)
}));

const getTriggersMock = vi.fn();
vi.mock('../helpers/getTriggers', () => ({
  default: () => getTriggersMock()
}));

vi.mock('./addTriggerContainer', () => ({
  default: () => <div data-testid="add-trigger-stub" />
}));

let capturedProps = null;
vi.mock('../components/triggerDisplay', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="trigger-display-stub" />;
  }
}));

import TriggerDisplayContainer from '../containers/triggerDisplayContainer';

const buildProps = (overrides = {}) => ({
  triggers: {
    data: [
      { _id: 't1', elementRef: 'slide-1', sortOrder: 0 },
      { _id: 't2', elementRef: 'slide-2', sortOrder: 1 },
      { _id: 't3', elementRef: 'slide-1', sortOrder: 2 }
    ],
    fetch: vi.fn(),
    set: vi.fn()
  },
  slide: { data: { ref: 'slide-1' } },
  router: { params: { id: 'scenario-1' } },
  ...overrides
});

describe('TriggerDisplayContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    vi.clearAllMocks();
    getTriggersMock.mockReturnValue([]);
  });

  it('only passes triggers whose elementRef matches the active slide ref', () => {
    render(<TriggerDisplayContainer {...buildProps()} />);
    expect(capturedProps.triggers.map((t) => t._id)).toEqual(['t1', 't3']);
  });

  it('opens the Add new trigger modal when add is clicked', () => {
    render(<TriggerDisplayContainer {...buildProps()} />);
    capturedProps.onAddTriggerClicked();

    expect(addModalMock).toHaveBeenCalled();
    expect(addModalMock.mock.calls[0][0].title).toBe('Add new trigger');
  });

  it('posts to /api/triggers when the modal returns a CREATE action', async () => {
    axiosPostMock.mockResolvedValue({});
    const props = buildProps();
    render(<TriggerDisplayContainer {...props} />);
    capturedProps.onAddTriggerClicked();

    const callback = addModalMock.mock.calls[0][1];
    callback('ACTION', { type: 'CREATE', modal: { foo: 'bar' } });

    expect(axiosPostMock).toHaveBeenCalledWith('/api/triggers', {
      scenario: 'scenario-1',
      elementRef: 'slide-1',
      triggerType: 'SLIDE',
      foo: 'bar'
    });

    await new Promise((r) => setTimeout(r, 0));
    expect(props.triggers.fetch).toHaveBeenCalled();
  });

  it('does not post when the modal action is anything other than CREATE', () => {
    render(<TriggerDisplayContainer {...buildProps()} />);
    capturedProps.onAddTriggerClicked();
    const callback = addModalMock.mock.calls[0][1];

    callback('ACTION', { type: 'CANCEL', modal: {} });
    expect(axiosPostMock).not.toHaveBeenCalled();
  });

  it('deletes a trigger and refetches when delete is clicked', async () => {
    axiosDeleteMock.mockResolvedValue({});
    const props = buildProps();
    render(<TriggerDisplayContainer {...props} />);

    capturedProps.onDeleteTriggerClicked('t1');

    expect(axiosDeleteMock).toHaveBeenCalledWith('/api/triggers/t1');
    await new Promise((r) => setTimeout(r, 0));
    expect(props.triggers.fetch).toHaveBeenCalled();
  });

  it('forwards errors from delete to handleRequestError', async () => {
    const error = new Error('delete failed');
    axiosDeleteMock.mockRejectedValue(error);
    render(<TriggerDisplayContainer {...buildProps()} />);

    capturedProps.onDeleteTriggerClicked('t1');
    await new Promise((r) => setTimeout(r, 0));
    expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
  });

  describe('sorting', () => {
    it('sorts triggers up by reordering and PUTting to the source trigger', async () => {
      axiosPutMock.mockResolvedValue({});
      const props = buildProps({
        triggers: {
          data: [
            { _id: 't1', elementRef: 'slide-1', sortOrder: 0 },
            { _id: 't2', elementRef: 'slide-1', sortOrder: 1 },
            { _id: 't3', elementRef: 'slide-1', sortOrder: 2 }
          ],
          fetch: vi.fn(),
          set: vi.fn()
        }
      });
      render(<TriggerDisplayContainer {...props} />);

      capturedProps.onSortUpClicked(2);

      expect(props.triggers.set).toHaveBeenCalled();
      const [reordered, options] = props.triggers.set.mock.calls[0];
      expect(options).toEqual({ setType: 'replace' });
      expect(reordered.map((t) => t._id)).toEqual(['t1', 't3', 't2']);
      expect(reordered[1].sortOrder).toBe(1);
      expect(reordered[2].sortOrder).toBe(2);

      expect(axiosPutMock).toHaveBeenCalledWith('/api/triggers/t3', { sourceIndex: 2, destinationIndex: 1 });
    });

    it('sorts triggers down by reordering and PUTting', () => {
      axiosPutMock.mockResolvedValue({});
      const props = buildProps({
        triggers: {
          data: [
            { _id: 't1', elementRef: 'slide-1', sortOrder: 0 },
            { _id: 't2', elementRef: 'slide-1', sortOrder: 1 },
            { _id: 't3', elementRef: 'slide-1', sortOrder: 2 }
          ],
          fetch: vi.fn(),
          set: vi.fn()
        }
      });
      render(<TriggerDisplayContainer {...props} />);

      capturedProps.onSortDownClicked(0);

      const [reordered] = props.triggers.set.mock.calls[0];
      expect(reordered.map((t) => t._id)).toEqual(['t2', 't1', 't3']);
      expect(axiosPutMock).toHaveBeenCalledWith('/api/triggers/t1', { sourceIndex: 0, destinationIndex: 1 });
    });
  });
});
