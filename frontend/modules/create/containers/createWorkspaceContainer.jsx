import React, { Component } from 'react';
import CreateWorkspace from '../components/createWorkspace';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';

class CreateWorkspaceContainer extends Component {
  render() {
    const { displayMode } = this.props.editor.data;
    return (
      <CreateWorkspace
        displayMode={displayMode}
      />
    );
  }
};

export default WithRouter(WithCache(CreateWorkspaceContainer, null, ['editor']));