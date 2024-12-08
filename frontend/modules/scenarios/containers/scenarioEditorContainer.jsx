import React, { Component } from 'react';
import ScenarioEditor from '../components/scenarioEditor';
import WithRouter from '~/core/app/components/withRouter';

class ScenarioEditorContainer extends Component {

  onToggleClicked = (value) => {
    const { navigate, params } = this.props.router;
    navigate(`/scenarios/${params.id}/${value}`, { viewTransition: true });
  }

  render() {

    const pathnameSplit = this.props.router.location.pathname.split('/');

    const pathValue = pathnameSplit[pathnameSplit.length - 1];

    return (
      <ScenarioEditor
        pathValue={pathValue}
        onToggleClicked={this.onToggleClicked}
      />
    );
  }
};

export default WithRouter(ScenarioEditorContainer);