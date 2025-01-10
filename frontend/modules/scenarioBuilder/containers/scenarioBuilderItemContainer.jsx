import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
import openCreateSlideDialog from '../helpers/openCreateSlideDialog';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import getSlideSelectionFromQuery from '../helpers/getSlideSelectionFromQuery';

class ScenarioBuilderItemContainer extends Component {

  shouldRenderChildren = () => {
    if (this.props.slide.isRoot) {
      if (this.props.slideSelection.length > 0) {
        return true;
      }
    } else {
      let slideSelection = getSlideSelectionFromQuery();
      if (slideSelection.length > 0) {
        if (slideSelection[this.props.layerIndex + 1] === this.props.itemIndex) {
          return true;
        }
      }
    }
    return false;
  }

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

  onToggleChildSlidesClicked = (action) => {
    if (action === 'OPEN') {
      this.openChildSlidesClicked();
    } else {
      this.closeChildSlidesClicked();
    }
  }

  openChildSlidesClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    if (this.props.slide.isRoot) {
      slideSelection = [0];
    } else {
      slideSelection.push(this.props.itemIndex);
    }
    const scenarioId = getCache('scenario').data._id;
    this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`);
  }

  closeChildSlidesClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    if (this.props.slide.isRoot) {
      slideSelection = [];
    } else {
      slideSelection.pop();
    }
    const scenarioId = getCache('scenario').data._id;
    this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`);
  }

  render() {
    return (
      <ScenarioBuilderItem
        slide={this.props.slide}
        slideSelection={this.props.slideSelection}
        layerIndex={this.props.layerIndex}
        shouldRenderChildren={this.shouldRenderChildren()}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
        onToggleChildSlidesClicked={this.onToggleChildSlidesClicked}
      />
    );
  }
};

export default WithRouter(ScenarioBuilderItemContainer);