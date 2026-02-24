import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import Loading from '~/uikit/loaders/components/loading';

const CohortCompletionStats = ({
  totalUsers,
  cohortCompletionCount,
  isLoading,
}: {
  totalUsers: number,
  cohortCompletionCount: number,
  isLoading: boolean,
}) => {
  if (isLoading) return <Loading />;
  return (
    <div className="py-2">
      <Badge
        icon="complete"
        iconSize={16}
        text={`${cohortCompletionCount} / ${totalUsers} users have completed all scenarios`}
      />
    </div>
  );
};

export default CohortCompletionStats;
