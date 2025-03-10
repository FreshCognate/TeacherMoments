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

  onCancelActioningClicked = () => {
    this.props.editor.set({ isActioning: false, actionType: null, actionId: null, actionElement: null });
  }

  render() {

    const {
      displayMode,
      actionElement,
      actionType,
      actionId,
      isActioning,
      isCreatingFromAction,
    } = this.props.editor?.data;
    const { isEditing, blockId } = this.getEditingBlockDetails();

    return (
      <ScenarioBuilder
        displayMode={displayMode}
        rootSlide={this.getRootSlide()}
        slideSelection={getSlideSelectionFromQuery()}
        blockId={blockId}
        actionElement={actionElement}
        actionType={actionType}
        actionId={actionId}
        isEditingBlock={isEditing}
        isActioning={isActioning}
        isCreatingFromAction={isCreatingFromAction}
        onCancelActioningClicked={this.onCancelActioningClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarionBuilderContainer, null, ['editor', 'scenario', 'slides']));