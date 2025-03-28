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

class BlocksEditorContainer extends Component {

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

  render() {
    return (
      <BlocksEditor
        blocks={this.getBlocksBySlide()}
        onCreateBlockClicked={this.onCreateBlockClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(BlocksEditorContainer, null, ['blocks']));