import React, { Component } from 'react';
import ScenarioEditor from '../components/scenarioEditor';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getSockets from '~/core/sockets/helpers/getSockets';
import getIsCurrentUser from '~/modules/authentication/helpers/getIsCurrentUser';

class ScenarioEditorContainer extends Component {

  componentDidUpdate = (prevProps) => {
    if (!prevProps.scenario.data?._id && this.props.scenario.data?._id) {
      this.setupListeners();
    }
  }

  setupListeners = async () => {
    const sockets = await getSockets();
    sockets.on(`SCENARIO:${this.props.scenario.data._id}_EVENT:LOCK_SLIDE`, (response) => {
      const isCurrentUser = getIsCurrentUser(response.userId);
      if (response.slide) {
        this.props.slides.set(response.slide, { setType: 'itemExtend', setFind: { _id: response.slide._id } })
        if (!isCurrentUser) {
          this.props.slides.fetch();
        }
      }
    });
  }

  onToggleClicked = (value) => {
    const { navigate, params } = this.props.router;
    navigate(`/scenarios/${params.id}/${value}`, { viewTransition: true, replace: true });
  }

  render() {

    const { slides, router } = this.props;

    const pathnameSplit = router.location.pathname.split('/');

    const pathValue = pathnameSplit[pathnameSplit.length - 1];

    return (
      <ScenarioEditor
        scenario={this.props.scenario.data}
        pathValue={pathValue}
        isLoading={slides.status === 'loading' || slides.status === 'unresolved'}
        onToggleClicked={this.onToggleClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioEditorContainer, {
  editor: {
    getInitialData: () => ({
      displayMode: 'EDITING'
    }),
    lifeTime: 0
  },
  scenario: {
    url: '/api/scenarios/:id',
    getInitialData: () => ({}),
    transform: ({ data }) => data.scenario,
    getParams: ({ props }) => {
      return { id: props.router.params.id };
    },
    lifeTime: 0,
    staleTime: 0
  },
  slides: {
    url: '/api/slides',
    getInitialData: () => ([]),
    transform: ({ data }) => data.slides,
    getParams: ({ props }) => {
      return { id: props.router.params.id };
    },
    getQuery: ({ props }) => {
      return { scenarioId: props.router.params.id };
    },
    lifeTime: 0,
    staleTime: 0
  },
  blocks: {
    url: '/api/blocks',
    getInitialData: () => ([]),
    transform: ({ data }) => data.blocks,
    getParams: ({ props }) => {
      return { id: props.router.params.id };
    },
    getQuery: ({ props }) => {
      return { scenarioId: props.router.params.id };
    },
    lifeTime: 0,
    staleTime: 0
  },
  triggers: {
    url: '/api/triggers',
    getInitialData: () => ([]),
    transform: ({ data }) => data.triggers,
    getParams: ({ props }) => {
      return {
        scenario: props.router.params.id
      }
    },
    getQuery: ({ props }) => {
      return {
        scenario: props.router.params.id
      }
    }
  }
}));