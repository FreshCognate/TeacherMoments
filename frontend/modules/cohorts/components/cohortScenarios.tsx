import React from 'react';
import { Scenario } from '~/modules/scenarios/scenarios.types';
import Collection from '~/uikit/collections/components/collection';
import Title from '~/uikit/content/components/title';
import CohortScenariosListContainer from '../containers/cohortScenariosListContainer';

const CohortScenarios = ({
  availableScenarios,
  availableScenariosSearchValue,
  availableScenariosCurrentPage,
  availableScenariosTotalPages,
  availableScenariosIsLoading,
  availableScenariosIsSyncing,
  getItemAttributes,
  getAvailableScenariosItemActions,
  getAvailableScenariosEmptyAttributes,
  onAvailableScenariosSearchValueChange,
  onAvailableScenariosPaginationClicked,
  onAvailableScenariosItemActionClicked,
  onAvailableScenariosEmptyActionClicked
}: {
  availableScenarios: Scenario[],
  availableScenariosSearchValue: string,
  availableScenariosCurrentPage: number,
  availableScenariosTotalPages: number,
  availableScenariosIsLoading: boolean,
  availableScenariosIsSyncing: boolean,
  getItemAttributes: (item: Scenario) => any,
  getAvailableScenariosItemActions: () => any[],
  getAvailableScenariosEmptyAttributes: () => { title: string, body: string, action?: { text: string, action: string }, help?: string },
  onAvailableScenariosSearchValueChange: (searchValue: string) => void,
  onAvailableScenariosPaginationClicked: (action: string) => void,
  onAvailableScenariosItemActionClicked: ({ itemId, action }: { itemId: string, action: string }) => void,
  onAvailableScenariosEmptyActionClicked: ({ action }: { action: string }) => void
}) => {
  return (
    <div className="grid grid-cols-2 gap-10 py-4">
      <div className="bg-lm-1 dark:bg-dm-1 p-4 dark:border-dm-2 rounded-md">
        <Title title="Scenarios in this Cohort" className="mb-2" />
        <CohortScenariosListContainer />
      </div>
      <div className="px-4">
        <Title title="Available scenarios" />
        <Collection
          items={availableScenarios}
          getItemActions={getAvailableScenariosItemActions}
          getItemAttributes={getItemAttributes}
          getEmptyAttributes={getAvailableScenariosEmptyAttributes}
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
          onEmptyActionClicked={onAvailableScenariosEmptyActionClicked}
        />
      </div>
    </div>
  );
};

export default CohortScenarios;