import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component: any) => Component
}));

const triggerExportMock = vi.fn();
vi.mock('~/modules/analytics/helpers/triggerExport', () => ({
  default: (args: any) => triggerExportMock(args)
}));

vi.mock('../components/userHistory', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="user-history-stub" />;
  }
}));

let capturedProps: any = null;

import UserHistoryContainer from '../containers/userHistoryContainer';

const buildHistoryResponses = (overrides: any = {}) => ({
  data: [],
  status: 'resolved',
  query: { searchValue: '', currentPage: 1 },
  response: { totalPages: 5, user: { _id: 'u-1' } },
  setStatus: vi.fn(),
  setQuery: vi.fn(),
  fetch: vi.fn(),
  ...overrides
});

describe('UserHistoryContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    triggerExportMock.mockReset();
    vi.useFakeTimers();
  });

  it('increments currentPage when pagination direction is "up"', () => {
    const historyResponses = buildHistoryResponses({
      query: { searchValue: '', currentPage: 2 }
    });
    render(<UserHistoryContainer historyResponses={historyResponses} />);

    capturedProps.onPaginationClicked('up');

    expect(historyResponses.setStatus).toHaveBeenCalledWith('syncing');
    expect(historyResponses.setQuery).toHaveBeenCalledWith({ currentPage: 3 });
    expect(historyResponses.fetch).toHaveBeenCalled();
  });

  it('decrements currentPage when pagination direction is not "up"', () => {
    const historyResponses = buildHistoryResponses({
      query: { searchValue: '', currentPage: 4 }
    });
    render(<UserHistoryContainer historyResponses={historyResponses} />);

    capturedProps.onPaginationClicked('down');

    expect(historyResponses.setQuery).toHaveBeenCalledWith({ currentPage: 3 });
  });

  it('resets currentPage to 1 when the search value changes', () => {
    const historyResponses = buildHistoryResponses({
      query: { searchValue: 'old', currentPage: 7 }
    });
    render(<UserHistoryContainer historyResponses={historyResponses} />);

    capturedProps.onSearchValueChange('new search');

    expect(historyResponses.setStatus).toHaveBeenCalledWith('syncing');
    expect(historyResponses.setQuery).toHaveBeenCalledWith({ searchValue: 'new search', currentPage: 1 });
  });

  it('debounces fetch calls when search value changes rapidly', () => {
    const historyResponses = buildHistoryResponses();
    render(<UserHistoryContainer historyResponses={historyResponses} />);

    capturedProps.onSearchValueChange('a');
    capturedProps.onSearchValueChange('ab');
    capturedProps.onSearchValueChange('abc');

    expect(historyResponses.fetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(800);

    expect(historyResponses.fetch).toHaveBeenCalledTimes(1);
  });

  it('triggers a USER_HISTORY export when export is clicked', () => {
    const historyResponses = buildHistoryResponses();
    render(<UserHistoryContainer historyResponses={historyResponses} />);

    capturedProps.onExportClicked();

    expect(triggerExportMock).toHaveBeenCalledWith({ exportType: 'USER_HISTORY' });
  });
});
