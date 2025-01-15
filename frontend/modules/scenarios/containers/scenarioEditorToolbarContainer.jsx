import React, { Component } from 'react';
import ScenarioEditorToolbar from '../components/scenarioEditorToolbar';
import WithCache from '~/core/cache/containers/withCache';
import addModal from '~/core/dialogs/helpers/addModal';
import BlockSelectorContainer from '~/modules/blocks/containers/blockSelectorContainer';

class ScenarioEditorToolbarContainer extends Component {

  onDisplayModeChanged = (displayMode) => {
    this.props.editor.set({ displayMode })
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
      <ScenarioEditorToolbar
        displayMode={displayMode}
        onDisplayModeChanged={this.onDisplayModeChanged}
        onAddBlockClicked={this.onAddBlockClicked}
      />
    );
  }
};

export default WithCache(ScenarioEditorToolbarContainer, null, ['editor']);