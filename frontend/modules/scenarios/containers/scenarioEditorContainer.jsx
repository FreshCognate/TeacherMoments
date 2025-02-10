import React, { Component } from 'react';
import ScenarioEditor from '../components/scenarioEditor';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getSockets from '~/core/sockets/helpers/getSockets';
import getIsCurrentUser from '~/modules/authentication/helpers/getIsCurrentUser';
import getEditingDetailsFromQuery from '~/modules/scenarioBuilder/helpers/getEditingDetailsFromQuery';
import getSlideSelectionFromQuery from '~/modules/scenarioBuilder/helpers/getSlideSelectionFromQuery';
import addToast from '~/core/dialogs/helpers/addToast';

class ScenarioEditorContainer extends Component {

  componentDidUpdate = (prevProps) => {
    if (!prevProps.scenario.data?._id && this.props.scenario.data?._id) {
      this.setupListeners();
    }
  }

  setupListeners = async () => {
    const sockets = await getSockets();

    sockets.on(`SCENARIO:${this.props.scenario.data._id}_EVENT:SLIDE_LOCK_STATUS`, (response) => {
      if (response.slide) {
        this.props.slides.set(response.slide, { setType: 'itemExtend', setFind: { _id: response.slide._id } });

        const isCurrentUser = getIsCurrentUser(response.userId);

        if (!isCurrentUser) {
          if (response.slide.isLocked) {
            const { isEditing, layer, slide } = getEditingDetailsFromQuery();
            if (isEditing && slide === response.slide._id) {
              let slideSelection = getSlideSelectionFromQuery();
              const scenarioId = this.props.scenario.data._id;
              let query = `slideSelection=${JSON.stringify(slideSelection)}`
              this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
            }
          }
          this.props.slides.fetch();
        }

      }
    });

    sockets.on(`SCENARIO:${this.props.scenario.data._id}_EVENT:SLIDE_REQUEST_ACCESS`, (payload) => {
      const {
        slideId,
        lockedBy,
      } = payload;

      const isCurrentUserEditing = getIsCurrentUser(lockedBy);

      if (isCurrentUserEditing) {
        const { isEditing, layer, slide } = getEditingDetailsFromQuery();
        if (isEditing && slide === slideId) {
          addToast({
            title: 'Another editor is asking to edit this slide.',
            timeout: 1000 * 10,
            actions: [{ type: 'CANCEL', text: 'Cancel' }, { type: 'ACCEPT', text: 'Accept' }]
          }, (state, payload) => {
            if (state === 'ACTION') {
              if (payload.type === 'CANCEL') {
                sockets.emit(`EVENT:SLIDE_DENY_ACCESS`, {
                  scenarioId: this.props.scenario.data._id,
                  slideId,
                  lockedBy,
                });
              } else if (payload.type === 'ACCEPT') {
                sockets.emit(`EVENT:SLIDE_ACCEPT_ACCESS`, {
                  scenarioId: this.props.scenario.data._id,
                  slideId,
                  lockedBy,
                });
              }
            }
          })
        }
      }
    });
  }

  componentWillUnmount = async () => {
    const sockets = await getSockets();
    sockets.off(`SCENARIO:${this.props.scenario.data._id}_EVENT:SLIDE_LOCK_STATUS`);
    sockets.off(`SCENARIO:${this.props.scenario.data._id}_EVENT:SLIDE_REQUEST_ACCESS`);
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