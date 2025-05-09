import React, { Component } from 'react';
import ScenarioBuilderItem from '../components/scenarioBuilderItem';
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
import getSockets from '~/core/sockets/helpers/getSockets';
import ScenarioRequestAccessTimer from '../components/scenarioRequestAccessTimer';
import addToast from '~/core/dialogs/helpers/addToast';
import duplicateSlide from '../helpers/duplicateSlide';
import moveSlide from '../helpers/moveSlide';

class ScenarioBuilderItemContainer extends Component {

  state = {
    isOptionsOpen: false,
    isDeleting: false,
    isAddingChild: false
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

          let slideSelection = getSlideSelectionFromQuery();
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
    editor.set({ isActioning: true, actionType: 'duplicate', actionId: this.props.slide._id, actionElement: 'slide' });
  }

  moveSlide = () => {
    const editor = getCache('editor');
    editor.set({ isActioning: true, actionType: 'move', actionId: this.props.slide._id, actionElement: 'slide' });
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

  takeOverEditing = () => {
    axios.put(`/api/slides/${this.props.slide._id}`, {
      isLocked: false
    }).then((response) => {
      const slides = getCache('slides');
      slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: this.props.slide._id } }).then(() => {
        this.onEditSlideClicked();
      });
    }).catch(handleRequestError);
  }

  onAddChildSlideClicked = () => {
    this.setState({ isAddingChild: true });
    const scenario = getCache('scenario').data;

    axios.post(`/api/slides`, {
      scenarioId: scenario._id,
      parentId: this.props.slide._id
    }).then((response) => {
      const newSlideId = get(response, 'data.slide._id');
      const slides = getCache('slides');
      slides.fetch().then(() => {
        this.setState({ isAddingChild: false });
        let slideSelection = getSlideSelectionFromQuery();
        if (slideSelection[this.props.layerIndex + 1] === 0 || slideSelection[this.props.layerIndex + 1]) {
          slideSelection[this.props.layerIndex + 1] = this.props.slide.children.length;
        } else {
          slideSelection.push(this.props.slide.children.length);
        }
        const scenarioId = getCache('scenario').data._id;
        const { isEditing, layer } = getEditingDetailsFromQuery();
        let query = `slideSelection=${JSON.stringify(slideSelection)}`;
        if (isEditing && layer === this.props.layerIndex + 1) {
          query += `&isEditing=${isEditing}&layer=${layer}&slide=${newSlideId}`;
        }
        this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
      });
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
    const { _id } = this.props.slide;
    document.getElementById(`scenario-builder-slide-${_id}`).scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById(`scenario-builder-slide-${_id}`).scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  onEditSlideClicked = () => {
    let slideSelection = getSlideSelectionFromQuery();
    const scenarioId = getCache('scenario').data._id;
    let layer = this.props.layerIndex;
    const { isRoot, _id, isLocked } = this.props.slide;
    if (isRoot) {
      layer = 'root';
    }
    slideSelection[this.props.layerIndex] = this.props.itemIndex;
    let query = `slideSelection=${JSON.stringify(slideSelection)}&isEditing=true&layer=${layer}&slide=${_id}`
    this.props.router.navigate(`/scenarios/${scenarioId}/create?${query}`, { replace: true });
    document.getElementById(`scenario-builder-slide-${_id}`).scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById(`scenario-builder-slide-${_id}`).scrollIntoView({ behavior: "smooth" });
    }, 0);
    if (!isLocked) {
      axios.put(`/api/slides/${_id}`, {
        isLocked: true
      }).then((response) => {
        const slides = getCache('slides');
        slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: _id } })
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
    if (this.props.slide.isLocked) {
      axios.put(`/api/slides/${this.props.slide._id}`, {
        isLocked: false
      }).then((response) => {
        const slides = getCache('slides');
        slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: this.props.slide._id } })
      })
    }
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
      case 'MOVE':
        this.onCancelEditingClicked();
        this.moveSlide();
        break;
    }
    this.setState({ isOptionsOpen: false });
  }

  onActionClicked = (position) => {
    const editor = getCache('editor');
    editor.set({ isCreatingFromAction: true });
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

    const { actionType, actionId } = editor.data;

    switch (actionType) {
      case 'duplicate':
        duplicateSlide({ slideId: actionId, scenarioId, parentId, sortOrder, layerIndex, navigate: this.props.router.navigate })
        break;
      case 'move':
        moveSlide({ slideId: actionId, scenarioId, parentId, sortOrder, layerIndex, navigate: this.props.router.navigate });
        break;
    }
  }

  onRequestAccessClicked = async () => {
    let removeCurrentModal;
    const sockets = await getSockets();
    const { _id, scenario, lockedBy } = this.props.slide;
    let shouldTakeOverEditing = true;

    sockets.emit(`EVENT:SLIDE_REQUEST_ACCESS`, {
      scenarioId: scenario,
      slideId: _id,
      lockedBy,
    });

    sockets.off(`SCENARIO:${scenario}_EVENT:SLIDE_DENY_ACCESS`);
    sockets.off(`SCENARIO:${scenario}_EVENT:SLIDE_ACCEPT_ACCESS`);

    sockets.on(`SCENARIO:${scenario}_EVENT:SLIDE_DENY_ACCESS`, (payload) => {
      if (_id === payload.slideId) {
        shouldTakeOverEditing = false;
        removeCurrentModal();
        addToast({ title: 'Editor denied your request to edit this slide.', body: 'Please try again later', timeout: 4000 })
      }
    });

    sockets.on(`SCENARIO:${scenario}_EVENT:SLIDE_ACCEPT_ACCESS`, (payload) => {
      if (_id === payload.slideId) {
        shouldTakeOverEditing = true;
        removeCurrentModal();
        this.takeOverEditing();
        addToast({ title: 'Editor has accepted your request to edit this slide.', timeout: 4000 })
      }
    })

    addModal({
      title: 'Requesting access to edit slide',
      body: 'You are requesting to take control over editing this slide. After 10 seconds you will automatically take control if the user does not respond.',
      component: <ScenarioRequestAccessTimer value={10} onFinish={() => {
        if (shouldTakeOverEditing) {
          removeCurrentModal();
          this.takeOverEditing();
        } else {
          removeCurrentModal();
        }
      }} />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel',
        color: 'primary'
      }]
    }, (state, payload) => {
      if (state === 'INIT') {
        removeCurrentModal = payload.removeModal
      }
    })
  }

  render() {

    const {
      slide,
      slideSelection,
      layerIndex,
      isSelected,
      isActioning,
      actionType,
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
        actionType={actionType}
        shouldRenderChildren={this.shouldRenderChildren()}
        isSelected={isSelected}
        isEditing={this.getIsEditing()}
        isEditingChildren={this.getIsEditingChildren()}
        isEditingSibling={this.getIsEditingSibling()}
        isOptionsOpen={isOptionsOpen}
        isDeleting={isDeleting}
        isActioning={isActioning}
        isAddingChild={this.state.isAddingChild}
        isLockedFromEditing={this.getIsLockedFromEditing()}
        childrenOffset={this.getChildrenOffset()}
        onAddChildSlideClicked={this.onAddChildSlideClicked}
        onToggleChildSlidesClicked={this.onToggleChildSlidesClicked}
        onSelectSlideClicked={this.onSelectSlideClicked}
        onEditSlideClicked={this.onEditSlideClicked}
        onCancelEditingClicked={this.onCancelEditingClicked}
        onOptionsToggled={this.onOptionsToggled}
        onOptionClicked={this.onOptionClicked}
        onActionClicked={this.onActionClicked}
        onRequestAccessClicked={this.onRequestAccessClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ScenarioBuilderItemContainer, null, ['slides', 'blocks']));