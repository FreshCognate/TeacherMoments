import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
import openCreateSlideDialog from '../helpers/openCreateSlideDialog';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import getSlideSelectionFromQuery from '../helpers/getSlideSelectionFromQuery';
import each from 'lodash/each';
import convertLayerIndexToLetter from '../helpers/convertLayerIndexToLetter';
import getEditingDetailsFromQuery from '../helpers/getEditingDetailsFromQuery';

class ScenarioBuilderItemContainer extends Component {

  getLocation = () => {
    if (this.props.slide.isRoot) return 'Root';
    let location = '';
    each(this.props.slideSelection, (itemIndex, layerIndex) => {
      if (layerIndex > this.props.layerIndex) return;
      const letter = convertLayerIndexToLetter(layerIndex);
      let currentItemIndex = itemIndex;
      if (layerIndex === this.props.layerIndex) {
        currentItemIndex = this.props.itemIndex;
      }
      if (layerIndex > 0) location += '.';
      location += `${letter}${currentItemIndex + 1}`;
    })
    return location;
  }

  getChildrenOffset = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const currentItemIndex = slideSelection[this.props.layerIndex + 1];
    return -((currentItemIndex * 440) + (16 * currentItemIndex));
  }

  getIsEditing = () => {
    const { isEditing, layer, slide } = getEditingDetailsFromQuery();
    if (!isEditing) return false;
    if (this.props.slide.isRoot) {
      if (layer === 'root') {
        return true;
      }
    }
    if (layer === this.props.layerIndex && this.props.slide._id === slide) return true;
    return false;
  }

  getIsEditingChildren = () => {
    const { isEditing, layer, slide } = getEditingDetailsFromQuery();
    if (!isEditing) return false;
    if (layer === this.props.layerIndex + 1) return true;
    return false;
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
      slideSelection.push(0);
    }
    const scenarioId = getCache('scenario').data._id;
    const { isEditing, layer, slide } = getEditingDetailsFromQuery();
    let query = `slideSelection=${JSON.stringify(slideSelection)}`;
    if (isEditing) {
      query += `&isEditing=${isEditing}&layer=${layer}&slide=${slide}`;
    }
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
  }

  closeChildSlidesClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    if (this.props.slide.isRoot) {
      slideSelection = [];
    } else {
      slideSelection.splice(this.props.layerIndex + 1, slideSelection.length - this.props.layerIndex);
    }
    const scenarioId = getCache('scenario').data._id;
    this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`, { replace: true });
  }

  onSelectSlideClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();

    slideSelection.splice(this.props.layerIndex, slideSelection.length - this.props.layerIndex);
    slideSelection.push(this.props.itemIndex);

    const scenarioId = getCache('scenario').data._id;
    this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`, { replace: true });
  }

  onEditSlideClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const scenarioId = getCache('scenario').data._id;
    let layer = this.props.layerIndex;
    if (this.props.slide.isRoot) {
      layer = 'root';
    }
    let query = `slideSelection=${JSON.stringify(slideSelection)}&isEditing=true&layer=${layer}&slide=${this.props.slide._id}`
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true })
  }

  onCancelEditingClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const scenarioId = getCache('scenario').data._id;
    let layer = this.props.layerIndex;
    if (this.props.slide.isRoot) {
      layer = 'root';
    }
    let query = `slideSelection=${JSON.stringify(slideSelection)}`
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true })
  }

  render() {
    return (
      <ScenarioBuilderItem
        slide={this.props.slide}
        slideSelection={this.props.slideSelection}
        layerIndex={this.props.layerIndex}
        location={this.getLocation()}
        shouldRenderChildren={this.shouldRenderChildren()}
        isSelected={this.props.isSelected}
        isEditing={this.getIsEditing()}
        isEditingChildren={this.getIsEditingChildren()}
        childrenOffset={this.getChildrenOffset()}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
        onToggleChildSlidesClicked={this.onToggleChildSlidesClicked}
        onSelectSlideClicked={this.onSelectSlideClicked}
        onEditSlideClicked={this.onEditSlideClicked}
        onCancelEditingClicked={this.onCancelEditingClicked}
      />
    );
  }
};

export default WithRouter(ScenarioBuilderItemContainer);