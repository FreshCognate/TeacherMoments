import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import WithCache from '../containers/withCache.jsx';
import { resetCache, getCache } from '../helpers/cacheManager.js';

const Display = ({ users }) => <div data-testid="data">{JSON.stringify(users?.data)}</div>;

describe('WithCache', () => {
  it('renders the wrapped component with cache data exposed under the cache key prop', () => {
    resetCache('users');
    const Wrapped = WithCache(Display, {
      users: { getInitialData: () => ({ count: 5 }) }
    });

    const { getByTestId } = render(<Wrapped />);
    expect(getByTestId('data')).toHaveTextContent('{"count":5}');
  });

  it('forwards original props to the wrapped component alongside cache props', () => {
    resetCache('users');
    const Probe = ({ extra, users }) => (
      <div>
        <span data-testid="extra">{extra}</span>
        <span data-testid="cache">{JSON.stringify(users?.data)}</span>
      </div>
    );
    const Wrapped = WithCache(Probe, {
      users: { getInitialData: () => ({ count: 1 }) }
    });

    const { getByTestId } = render(<Wrapped extra="forwarded" />);
    expect(getByTestId('extra')).toHaveTextContent('forwarded');
    expect(getByTestId('cache')).toHaveTextContent('{"count":1}');
  });

  it('marks the cache as mounted on mount and unmounted on unmount', () => {
    resetCache('users');
    const Wrapped = WithCache(Display, {
      users: { getInitialData: () => ({}) }
    });

    const { unmount } = render(<Wrapped />);
    expect(getCache('users').isMounted).toBe(true);

    unmount();
    expect(getCache('users').isMounted).toBe(false);
  });

  it('triggers a re-render when a cache update fires', () => {
    resetCache('users');
    const renderSpy = vi.fn();
    const Counter = ({ users }) => {
      renderSpy();
      return <div data-testid="count">{users?.data?.count ?? 0}</div>;
    };
    const Wrapped = WithCache(Counter, {
      users: { getInitialData: () => ({ count: 0 }) }
    });

    const { getByTestId } = render(<Wrapped />);
    const initialRenders = renderSpy.mock.calls.length;
    expect(getByTestId('count')).toHaveTextContent('0');

    act(() => {
      getCache('users').set({ count: 7 });
    });

    expect(renderSpy.mock.calls.length).toBeGreaterThan(initialRenders);
    expect(getByTestId('count')).toHaveTextContent('7');
  });
});
