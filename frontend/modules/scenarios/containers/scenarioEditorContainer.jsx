import React, { Component } from 'react';
import ScenarioEditor from '../components/scenarioEditor';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';

class ScenarioEditorContainer extends Component {

  onToggleClicked = (value) => {
    const { navigate, params } = this.props.router;
    navigate(`/scenarios/${params.id}/${value}`, { viewTransition: true, replace: true });
  }

  render() {

    const pathnameSplit = this.props.router.location.pathname.split('/');

    const pathValue = pathnameSplit[pathnameSplit.length - 1];

    return (
      <ScenarioEditor
        scenario={this.props.scenario.data}
        pathValue={pathValue}
        onToggleClicked={this.onToggleClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioEditorContainer, {
  scenario: {
    url: '/api/scenarios/:id',
    getInitialData: () => ({}),
    transform: ({ data }) => data.scenario,
    getParams: ({ props }) => {
      return { id: props.router.params.id };
    }
  },
  slides: {
    url: '/api/slides',
    getInitialData: () => ([]),
    transform: ({ data }) => data.slides,
    getParams: ({ props }) => {
      return { id: props.router.params.id };
    },
    getQuery: ({ props }) => {
      return { scenario: props.router.params.id };
    }
  }
}));