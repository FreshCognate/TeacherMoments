import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
import openCreateSlideDialog from '../helpers/openCreateSlideDialog';
import axios from 'axios';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import getSlideSelectionFromQuery from '../helpers/getSlideSelectionFromQuery';
import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import convertLayerIndexToLetter from '../helpers/convertLayerIndexToLetter';
import getEditingDetailsFromQuery from '../helpers/getEditingDetailsFromQuery';
import addModal from '~/core/dialogs/helpers/addModal';
import cloneDeep from 'lodash/cloneDeep';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import WithCache from '~/core/cache/containers/withCache';
import getIsCurrentUser from '~/modules/authentication/helpers/getIsCurrentUser';

class ScenarioBuilderItemContainer extends Component {

  state = {
    isOptionsOpen: false,
    isDeleting: false
  }

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

  getIsEditingSibling = () => {
    const { isEditing, layer } = getEditingDetailsFromQuery();
    if (!isEditing) return false;
    if (this.props.slide.isRoot) {
      if (layer === 'root') {
        return false;
      }
    }
    if (layer === this.props.layerIndex) return true;
    return false;
  }

  getIsEditingChildren = () => {
    const { isEditing, layer, slide } = getEditingDetailsFromQuery();
    if (!isEditing) return false;
    if (layer === this.props.layerIndex + 1) return true;
    return false;
  }

  getBlocksCount = () => {
    const blocks = getCache('blocks');
    const slideBlocks = filter(blocks.data, (block) => block.slideRef === this.props.slide.ref);
    return slideBlocks.length;
  }

  getTriggersCount = () => {
    const triggers = getCache('triggers');
    const slideTriggers = filter(triggers.data, (trigger) => trigger.elementRef === this.props.slide.ref);
    return slideTriggers.length;
  }

  getSelectedSlide = () => {
    const slideSelection = getSlideSelectionFromQuery();
    if (slideSelection[this.props.layerIndex + 1] === 0 || slideSelection[this.props.layerIndex + 1] > 0) {
      return slideSelection[this.props.layerIndex + 1] + 1;
    } else {
      return 0;
    }
  }

  getIsLockedFromEditing = () => {
    const { isLocked, lockedBy } = this.props.slide;
    const isCurrentUser = getIsCurrentUser(lockedBy);
    if (isLocked && !isCurrentUser) {
      return true;
    }
    return false;
  }

  deleteSlide = () => {
    addModal({
      title: 'Delete slide',
      body: "Are you sure you want to delete this slide? Don't worry, you can always restore a slide.",
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'DELETE',
        text: 'Delete',
        color: 'warning'
      }]
    }, async (state, { type }) => {
      if (state === 'ACTION' && type === 'DELETE') {
        this.setState({ isDeleting: true });
        axios.delete(`/api/slides/${this.props.slide._id}`).then(async () => {
          const slides = getCache('slides');
          const blocks = getCache('blocks');

          const slideSelection = getSlideSelectionFromQuery();
          const parentSlide = find(slides.data, (slide) => slide.ref === this.props.parent);
          const parentChildren = cloneDeep(parentSlide.children);

          parentChildren.splice(this.props.itemIndex, 1);

          if (parentChildren.length > 0) {
            let newItemIndex = 0;
            if (this.props.itemIndex > 0) {
              newItemIndex = this.props.itemIndex - 1;
            }
            const scenarioId = getCache('scenario').data._id;
            slideSelection[this.props.layerIndex] = newItemIndex;
            let query = `slideSelection=${JSON.stringify(slideSelection)}`
            this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true })
          } else {
            if (this.props.slide.isRoot) {
              slideSelection = [];
            } else {
              slideSelection.splice(this.props.layerIndex, slideSelection.length - this.props.layerIndex);
            }
            const scenarioId = getCache('scenario').data._id;
            this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`, { replace: true });
          }
          blocks.fetch();
          slides.fetch();

        }).catch(handleRequestError);
      }
    })
  }

  duplicateSlide = () => {
    const editor = getCache('editor');
    editor.set({ isDuplicating: true, duplicateId: this.props.slide._id, duplicateType: 'slide' });
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
              scenarioId: scenario._id,
              parentId: this.props.slide._id
            }).then((response) => {
              const newSlideId = get(response, 'data.slide._id');
              const slides = getCache('slides');
              slides.fetch().then(() => {
                let slideSelection = getSlideSelectionFromQuery();
                if (slideSelection[this.props.layerIndex + 1] === 0 || slideSelection[this.props.layerIndex + 1]) {
                  slideSelection[this.props.layerIndex + 1] = this.props.slide.children.length;
                } else {
                  slideSelection.push(this.props.slide.children.length);
                }
                const scenarioId = getCache('scenario').data._id;
                const { isEditing, layer, slide } = getEditingDetailsFromQuery();
                let query = `slideSelection=${JSON.stringify(slideSelection)}`;
                if (isEditing && layer === this.props.layerIndex + 1) {
                  query += `&isEditing=${isEditing}&layer=${layer}&slide=${newSlideId}`;
                }
                this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
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
    slideSelection[this.props.layerIndex] = this.props.itemIndex;
    let query = `slideSelection=${JSON.stringify(slideSelection)}&isEditing=true&layer=${layer}&slide=${this.props.slide._id}`
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
    if (!this.props.slide.isLocked) {
      axios.put(`/api/slides/${this.props.slide._id}`, {
        isLocked: true
      }).then((response) => {
        const slides = getCache('slides');
        slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: this.props.slide._id } })
      })
    }
  }

  onCancelEditingClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const scenarioId = getCache('scenario').data._id;
    let layer = this.props.layerIndex;
    if (this.props.slide.isRoot) {
      layer = 'root';
    }
    let query = `slideSelection=${JSON.stringify(slideSelection)}`
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
  }

  onOptionsToggled = (isOptionsOpen) => {
    this.setState({ isOptionsOpen });
  }

  onOptionClicked = (action) => {
    switch (action) {
      case 'DELETE':
        this.deleteSlide();
        break;
      case 'DUPLICATE':
        this.onCancelEditingClicked();
        this.duplicateSlide();
        break;
    }
    this.setState({ isOptionsOpen: false });
  }

  onPasteSlideClicked = (position) => {
    const editor = getCache('editor');
    editor.set({ isCreatingDuplicate: true });
    const scenarioId = getCache('scenario').data._id;

    let sortOrder = 0;
    let parentId = this.props.slide._id;
    let layerIndex = this.props.layerIndex;
    const slides = getCache('slides');
    const parentSlide = find(slides.data, (slide) => slide.ref === this.props.parent);

    switch (position) {
      case 'CHILD':
        sortOrder = this.props.slide.children.length;
        layerIndex++;
        break;
      case 'BEFORE':
        sortOrder = this.props.itemIndex;
        parentId = parentSlide._id;
        break;
      case 'AFTER':
        sortOrder = this.props.itemIndex + 1;
        parentId = parentSlide._id;
        break;
    }

    axios.post(`/api/slides`, {
      scenarioId: scenarioId,
      slideId: editor.data.duplicateId,
      parentId,
      sortOrder
    }).then(async () => {
      const slides = getCache('slides');
      const blocks = getCache('blocks');
      await blocks.fetch();
      await slides.fetch();
      // Navigate to duplicated slide
      let slideSelection = getSlideSelectionFromQuery();

      slideSelection.splice(layerIndex, slideSelection.length - layerIndex);
      slideSelection.push(sortOrder);

      const scenarioId = getCache('scenario').data._id;
      this.props.router.navigate(`/scenarios/${scenarioId}/create?slideSelection=${JSON.stringify(slideSelection)}`, { replace: true });

      editor.set({
        isCreatingDuplicate: false,
        isDuplicating: false,
        duplicateId: null,
        duplicateType: null
      });
    }).catch((error) => {
      handleRequestError(error);
      editor.set({
        isCreatingDuplicate: false,
        isDuplicating: false,
        duplicateId: null,
        duplicateType: null
      });
    });
  }

  render() {

    const {
      slide,
      slideSelection,
      layerIndex,
      isSelected,
      isDuplicating
    } = this.props;

    const {
      isOptionsOpen,
      isDeleting
    } = this.state;

    return (
      <ScenarioBuilderItem
        slide={slide}
        parent={slide.ref}
        slideSelection={slideSelection}
        selectedSlide={this.getSelectedSlide()}
        blocksCount={this.getBlocksCount()}
        triggersCount={this.getTriggersCount()}
        layerIndex={layerIndex}
        location={this.getLocation()}
        shouldRenderChildren={this.shouldRenderChildren()}
        isSelected={isSelected}
        isEditing={this.getIsEditing()}
        isEditingChildren={this.getIsEditingChildren()}
        isEditingSibling={this.getIsEditingSibling()}
        isOptionsOpen={isOptionsOpen}
        isDeleting={isDeleting}
        isDuplicating={isDuplicating}
        isLockedFromEditing={this.getIsLockedFromEditing()}
        childrenOffset={this.getChildrenOffset()}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
        onToggleChildSlidesClicked={this.onToggleChildSlidesClicked}
        onSelectSlideClicked={this.onSelectSlideClicked}
        onEditSlideClicked={this.onEditSlideClicked}
        onCancelEditingClicked={this.onCancelEditingClicked}
        onOptionsToggled={this.onOptionsToggled}
        onOptionClicked={this.onOptionClicked}
        onPasteSlideClicked={this.onPasteSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioBuilderItemContainer, null, ['slides', 'blocks']));