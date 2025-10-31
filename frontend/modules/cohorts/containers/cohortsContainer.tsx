import React, { Component } from 'react';
import Cohorts from '../components/cohorts';

class CohortsContainer extends Component {

  onActionClicked = ({ action }: { action: string }) => {
    switch (action) {
      case 'CREATE': {
        console.log("Create new cohort");
      }
    }
  }

  render() {
    return (
      <Cohorts
        actions={[{ action: 'CREATE', text: 'Create cohort', color: 'primary' }]}
        // searchValue,
        // currentPage,
        // totalPages,
        // filter,
        // filters,
        // sortBy,
        // sortByOptions,
        // isSyncing,
        // isLoading,
        // onSearchValueChange,
        // onPaginationClicked,
        // onFiltersChanged,
        // onSortByChanged,
        onActionClicked={this.onActionClicked}
      />
    );
  }
};

export default CohortsContainer;