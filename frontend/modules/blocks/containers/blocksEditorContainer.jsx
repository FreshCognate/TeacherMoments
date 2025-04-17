import React, { Component } from 'react';
import BlocksEditor from '../components/blocksEditor';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getCache from '~/core/cache/helpers/getCache';
import addModal from '~/core/dialogs/helpers/addModal';
import BlockSelectorContainer from './blockSelectorContainer';
import getIsCurrentUser from '~/modules/authentication/helpers/getIsCurrentUser';
import ScenarioRequestAccessTimer from '~/modules/scenarioBuilder/components/scenarioRequestAccessTimer';
import getSockets from '~/core/sockets/helpers/getSockets';
import addToast from '~/core/dialogs/helpers/addToast';

class BlocksEditorContainer extends Component {

  componentDidUpdate = (prevProps) => {
    if (prevProps.slideId !== this.props.slideId) {
      this.attemptToLockSlide(prevProps.slideId);
    }
  }

  attemptToLockSlide = (prevSlideId) => {
    if (!this.getIsLockedFromEditing()) {
      axios.put(`/api/slides/${this.props.slideId}`, {
        isLocked: true
      }).then((response) => {
        const slides = getCache('slides');
        slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: this.props.slideId } })
      })
    } else {
      if (prevSlideId) {
        axios.put(`/api/slides/${prevSlideId}`, {
          isLocked: false
        }).then((response) => {
          const slides = getCache('slides');
          slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: prevSlideId } })
        })
      }
    }
  }


  getBlocksBySlide = () => {
    const slides = getCache('slides');
    if (slides.data) {
      const searchParams = new URLSearchParams(this.props.router.location.search);
      const slideId = searchParams.get('slide');

      const slide = find(slides.data, { _id: slideId })
      if (slide) {
        const slideRef = slide.ref;
        return sortBy(filter(this.props.blocks.data, (block) => {
          if (block.slideRef === slideRef) {
            return block;
          }
        }), 'sortOrder');
      }

      return [];

    }
  }

  getIsLockedFromEditing = () => {
    const slides = getCache('slides');
    if (slides.data) {
      const searchParams = new URLSearchParams(this.props.router.location.search);
      const slideId = searchParams.get('slide');

      const slide = find(slides.data, { _id: slideId })

      if (slide) {
        const { isLocked, lockedBy } = slide;
        const isCurrentUser = getIsCurrentUser(lockedBy);
        if (isLocked && !isCurrentUser) {
          return true;
        }
      }
    }
    return false;
  }

  onDeleteBlockClicked = (blockId) => {
    this.props.blocks.setStatus('syncing');
    axios.delete(`/api/blocks/${blockId}`).then(() => {
      this.props.blocks.fetch();
    }).catch(handleRequestError);
  }

  sortBlocks = ({ sourceIndex, destinationIndex, blocks }) => {
    const clonedBlocks = cloneDeep(this.getBlocksBySlide());
    const [removed] = clonedBlocks.splice(sourceIndex, 1);
    clonedBlocks.splice(destinationIndex, 0, removed);

    each(clonedBlocks, (item, index) => {
      item.sortOrder = index;
      blocks.set(item, { setType: 'itemExtend', setFind: { _id: item._id } });
    });

    axios.put(`/api/blocks/${removed._id}`, { sourceIndex, destinationIndex }).then(() => {
      this.props.blocks.fetch();
    }).catch(handleRequestError);
  }

  takeOverEditing = () => {
    const slides = getCache('slides');
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');

    const slide = find(slides.data, { _id: slideId })
    axios.put(`/api/slides/${slide._id}`, {
      isLocked: true
    }).then((response) => {
      const slides = getCache('slides');
      slides.set(response.data.slide, { setType: 'itemExtend', setFind: { _id: slide._id } }).then(() => {

      });
    }).catch(handleRequestError);
  }

  onSortUpClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder - 1;

    this.sortBlocks({ sourceIndex, destinationIndex, blocks: this.props.blocks });
  }

  onSortDownClicked = (sortOrder) => {

    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder + 1;

    this.sortBlocks({ sourceIndex, destinationIndex, blocks: this.props.blocks });

  }

  onCreateBlockClicked = () => {
    addModal({
      title: 'Choose a block type to add to your slide:',
      component: <BlockSelectorContainer />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }]
    })
  }

  onRequestAccessClicked = async () => {
    let removeCurrentModal;
    const sockets = await getSockets();
    const slides = getCache('slides');

    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');

    const slide = find(slides.data, { _id: slideId })

    const { _id, scenario, lockedBy } = slide;
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
        this.takeOverEditing(_id);
        addToast({ title: 'Editor has accepted your request to edit this slide.', timeout: 4000 })
      }
    })

    addModal({
      title: 'Requesting access to edit slide',
      body: 'You are requesting to take control over editing this slide. After 10 seconds you will automatically take control if the user does not respond.',
      component: <ScenarioRequestAccessTimer value={10} onFinish={() => {
        if (shouldTakeOverEditing) {
          removeCurrentModal();
          this.takeOverEditing(_id);
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
    const isLockedFromEditing = this.getIsLockedFromEditing();
    return (
      <BlocksEditor
        blocks={this.getBlocksBySlide()}
        isLockedFromEditing={isLockedFromEditing}
        onCreateBlockClicked={this.onCreateBlockClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
        onRequestAccessClicked={this.onRequestAccessClicked}
      />
    );
  }
};

export default WithRouter(WithCache(BlocksEditorContainer, null, ['blocks', 'slide']));