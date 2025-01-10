import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
import openCreateSlideDialog from '../helpers/openCreateSlideDialog';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';

class ScenarioBuilderItemContainer extends Component {

  onAddChildSlideClicked = () => {
    openCreateSlideDialog((state, { type, modal }) => {
      if (state === 'ACTION') {
        if (type === 'CREATE') {
          const scenario = getCache('scenario').data;
          if (!modal.slideRef) {
            axios.post(`/api/slides`, {
              name: modal.name,
              scenario: scenario._id,
              parent: this.props.slide._id
            }).then(() => {
              const slides = getCache('slides');
              slides.fetch();
            })
          }
        }
      }
    });
  }

  render() {
    return (
      <ScenarioBuilderItem
        slide={this.props.slide}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
      />
    );
  }
};

export default WithRouter(ScenarioBuilderItemContainer);