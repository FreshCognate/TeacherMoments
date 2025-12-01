import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import Collection from '~/uikit/collections/components/collection';
import Title from '~/uikit/content/components/title';
import CohortScenariosListContainer from '../containers/cohortScenariosListContainer';

const CohortScenarios = ({
  cohortScenarios,
  cohortScenariosSearchValue,
  cohortScenariosCurrentPage,
  cohortScenariosTotalPages,
  cohortScenariosIsLoading,
  cohortScenariosIsSyncing,
  availableScenarios,
  availableScenariosSearchValue,
  availableScenariosCurrentPage,
  availableScenariosTotalPages,
  availableScenariosIsLoading,
  availableScenariosIsSyncing,
  getItemAttributes,
  getCohortScenariosItemActions,
  getAvailableScenariosItemActions,
  onCohortScenariosSearchValueChange,
  onCohortScenariosPaginationClicked,
  onCohortScenariosItemActionClicked,
  onAvailableScenariosSearchValueChange,
  onAvailableScenariosPaginationClicked,
  onAvailableScenariosItemActionClicked
}: {
  cohortScenarios: Scenario[],
  cohortScenariosSearchValue: string,
  cohortScenariosCurrentPage: number,
  cohortScenariosTotalPages: number,
  cohortScenariosIsLoading: boolean,
  cohortScenariosIsSyncing: boolean,
  availableScenarios: Scenario[],
  availableScenariosSearchValue: string,
  availableScenariosCurrentPage: number,
  availableScenariosTotalPages: number,
  availableScenariosIsLoading: boolean,
  availableScenariosIsSyncing: boolean,
  getItemAttributes: (item: Scenario) => any,
  getCohortScenariosItemActions: () => any[],
  getAvailableScenariosItemActions: () => any[],
  onCohortScenariosSearchValueChange: (searchValue: string) => void,
  onCohortScenariosPaginationClicked: (action: string) => void,
  onCohortScenariosItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void
  onAvailableScenariosSearchValueChange: (searchValue: string) => void,
  onAvailableScenariosPaginationClicked: (action: string) => void,
  onAvailableScenariosItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void
}) => {
  return (
    <div className="grid grid-cols-2 gap-10 px-10 py-4">
      <div className="border border-lm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Cohort scenarios" />
        <CohortScenariosListContainer />
        <Collection
          items={cohortScenarios}
          getItemActions={getCohortScenariosItemActions}
          getItemAttributes={getItemAttributes}
          searchPlaceholder="Search scenarios..."
          searchValue={cohortScenariosSearchValue}
          currentPage={cohortScenariosCurrentPage}
          totalPages={cohortScenariosTotalPages}
          hasSearch
          hasPagination
          isLoading={cohortScenariosIsLoading}
          isSyncing={cohortScenariosIsSyncing}
          onSearchValueChange={onCohortScenariosSearchValueChange}
          onPaginationClicked={onCohortScenariosPaginationClicked}
          onItemActionClicked={onCohortScenariosItemActionClicked}
        />
      </div>
      <div className="border border-lm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Available scenarios" />
        <Collection
          items={availableScenarios}
          getItemActions={getAvailableScenariosItemActions}
          getItemAttributes={getItemAttributes}
          searchPlaceholder="Search scenarios..."
          searchValue={availableScenariosSearchValue}
          currentPage={availableScenariosCurrentPage}
          totalPages={availableScenariosTotalPages}
          hasSearch
          hasPagination
          isLoading={availableScenariosIsLoading}
          isSyncing={availableScenariosIsSyncing}
          onSearchValueChange={onAvailableScenariosSearchValueChange}
          onPaginationClicked={onAvailableScenariosPaginationClicked}
          onItemActionClicked={onAvailableScenariosItemActionClicked}
        />
      </div>
    </div>
  );
};

export default CohortScenarios;