import React, { Component } from 'react';
import CreateWorkspaceToolbar from '../components/createWorkspaceToolbar';
import WithCache from '~/core/cache/containers/withCache';
import BlockSelectorContainer from '~/modules/blocks/containers/blockSelectorContainer';
import addModal from '~/core/dialogs/helpers/addModal';

class CreateWorkspaceToolbarContainer extends Component {
  onDisplayModeChanged = (displayMode) => {
    this.props.editor.set({ displayMode });
    if (displayMode === 'PREVIEW') {
      document.getElementById("scenario-builder").scrollTo({ top: 0, behaviour: 'instant' });
    }
  }

  onAddBlockClicked = () => {
    addModal({
      title: 'Choose a block type to add to your slide:',
      component: <BlockSelectorContainer />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }]
    })
  }

  render() {
    const { displayMode } = this.props.editor.data;
    return (
      <CreateWorkspaceToolbar
        displayMode={displayMode}
        onDisplayModeChanged={this.onDisplayModeChanged}
        onAddBlockClicked={this.onAddBlockClicked}
      />
    );
  }
};

export default WithCache(CreateWorkspaceToolbarContainer, null, ['editor']);