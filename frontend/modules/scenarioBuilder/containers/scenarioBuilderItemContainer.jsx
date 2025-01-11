import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
import openCreateSlideDialog from '../helpers/openCreateSlideDialog';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import getSlideSelectionFromQuery from '../helpers/getSlideSelectionFromQuery';

class ScenarioBuilderItemContainer extends Component {

  getChildrenOffset = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const currentItemIndex = slideSelection[this.props.layerIndex + 1];
    return -((currentItemIndex * 256) + (16 * currentItemIndex));
  }

  shouldRenderChildren = () => {

    let slideSelection = getSlideSelectionFromQuery();
    if (slideSelection.length > 0 && this.props.isSelected) {
      if (this.props.slide.isRoot) {
        return true
      }
      if (slideSelection[this.props.layerIndex + 1] === 0 || slideSelection[this.props.layerIndex + 1]) {
        return true;
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
              slides.fetch().then(() => {
                this.openChildSlidesClicked();
              });
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

  onSelectSlideClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();

    slideSelection.splice(this.props.layerIndex, slideSelection.length - this.props.layerIndex);
    slideSelection.push(this.props.itemIndex);

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
        isSelected={this.props.isSelected}
        childrenOffset={this.getChildrenOffset()}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
        onToggleChildSlidesClicked={this.onToggleChildSlidesClicked}
        onSelectSlideClicked={this.onSelectSlideClicked}
      />
    );
  }
};

export default WithRouter(ScenarioBuilderItemContainer);