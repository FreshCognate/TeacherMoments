import React, { Component } from 'react';
import ScenarioBuilder from '../components/scenarioBuilder';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import getSlideSelectionFromQuery from '../helpers/getSlideSelectionFromQuery';

class ScenarionBuilderContainer extends Component {

  getRootSlide = () => {
    const rootSlide = find(this.props.slides.data, { isRoot: true });
    return rootSlide;
  }

  getEditingBlockDetails = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const blockId = searchParams.get('block');
    const isEditing = searchParams.get('isEditing');

    return {
      isEditing: blockId && isEditing,
      blockId
    };
  }

  onCancelDuplicatingClicked = () => {
    this.props.editor.set({ isDuplicating: false, duplicateType: null, duplicateId: null });
  }

  render() {

    const {
      displayMode,
      duplicateType,
      duplicateId,
      isDuplicating,
      isCreatingDuplicate,
    } = this.props.editor?.data;
    const { isEditing, blockId } = this.getEditingBlockDetails();

    return (
      <ScenarioBuilder
        displayMode={displayMode}
        rootSlide={this.getRootSlide()}
        slideSelection={getSlideSelectionFromQuery()}
        blockId={blockId}
        duplicateType={duplicateType}
        duplicateId={duplicateId}
        isEditingBlock={isEditing}
        isDuplicating={isDuplicating}
        isCreatingDuplicate={isCreatingDuplicate}
        onCancelDuplicatingClicked={this.onCancelDuplicatingClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarionBuilderContainer, null, ['editor', 'scenario', 'slides']));