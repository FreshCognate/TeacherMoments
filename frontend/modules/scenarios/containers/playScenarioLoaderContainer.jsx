import React, { Component } from 'react';
import PlayScenarioContainer from './playScenarioContainer';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import getCohortFromSearchParams from '~/modules/cohorts/helpers/getCohortFromSearchParams';
import Loading from '~/uikit/loaders/components/loading';

class PlayScenarioLoaderContainer extends Component {
  render() {
    const { scenario, slides, blocks, triggers, run } = this.props;
    if (scenario.data && slides.data && blocks.data && triggers.data && run.data) {
      return (
        <PlayScenarioContainer />
      );
    }
    return <Loading />;
  }
};

export default WithRouter(WithCache(PlayScenarioLoaderContainer, {
  scenario: {
    url: '/api/play/:publishLink',
    getParams: ({ props }) => {
      return {
        publishLink: props.router.params.publishLink
      };
    },
    transform: ({ data }) => data.scenario
  },
  slides: {
    url: '/api/play/slides',
    getQuery: () => {
      return {
        scenario: getCache('scenario').data._id
      }
    },
    getParams: ({ props }) => {
      return {
        publishLink: props.router.params.publishLink
      };
    },
    transform: ({ data }) => data.slides,
    getDependencies: ({ props }) => {
      const scenario = getCache('scenario');
      return [scenario?.data?._id]
    }
  },
  blocks: {
    url: '/api/play/blocks',
    getQuery: () => {
      return {
        scenario: getCache('scenario').data._id
      }
    },
    getParams: ({ props }) => {
      return {
        publishLink: props.router.params.publishLink
      };
    },
    transform: ({ data }) => data.blocks,
    getDependencies: ({ props }) => {
      const scenario = getCache('scenario');
      return [scenario?.data?._id]
    }
  },
  triggers: {
    url: '/api/play/triggers',
    getQuery: () => {
      return {
        scenario: getCache('scenario').data._id
      }
    },
    getParams: ({ props }) => {
      return {
        publishLink: props.router.params.publishLink
      };
    },
    transform: ({ data }) => data.triggers,
    getDependencies: ({ props }) => {
      const scenario = getCache('scenario');
      return [scenario?.data?._id]
    }
  },
  run: {
    url: '/api/play/runs/:id',
    getParams: ({ }) => {
      return {
        id: getCache('scenario')?.data?._id
      }
    },
    getQuery: ({ props }) => {
      const cohort = getCohortFromSearchParams(props.router);
      return {
        cohort
      }
    },
    transform: ({ data }) => data.run,
    getDependencies: ({ props }) => {
      const scenario = getCache('scenario');
      return [scenario?.data?._id]
    }
  }
}));