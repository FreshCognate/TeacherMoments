import AnalyticsContainer from '~/modules/analytics/containers/analyticsContainer';
import { AnalyticsViewType, UserResponse } from '~/modules/analytics/analytics.types';

interface UserHistoryProps {
  user?: any;
  responses: UserResponse[];
  isLoading: boolean;
  isSyncing?: boolean;
  searchValue?: string;
  currentPage?: number;
  totalPages?: number;
  onSearchValueChange?: (searchValue: string) => void;
  onPaginationClicked?: (direction: string) => void;
  onExportClicked?: () => void;
}

const UserHistory = ({
  user,
  responses,
  isLoading,
  isSyncing,
  searchValue,
  currentPage,
  totalPages,
  onSearchValueChange,
  onPaginationClicked,
  onExportClicked
}: UserHistoryProps) => {
  return (
    <div className="pt-20">
      <AnalyticsContainer
        viewType="byUserScenarios"
        user={user}
        responses={responses}
        isLoading={isLoading}
        isSyncing={isSyncing}
        searchValue={searchValue}
        currentPage={currentPage}
        totalPages={totalPages}
        onSearchValueChange={onSearchValueChange}
        onPaginationClicked={onPaginationClicked}
        onExportClicked={onExportClicked}
      />
    </div>
  );
};

export default UserHistory;
