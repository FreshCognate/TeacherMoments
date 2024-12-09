import React, { Component } from 'react';
import BlocksEditor from '../components/blocksEditor';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import each from 'lodash/each';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class BlocksEditorContainer extends Component {

  getBlocksBySlide = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    return filter(this.props.blocks.data, (block) => {
      if (block.slide === slideId) {
        return block;
      }
    })
  }

  onDeleteBlockClicked = (blockId) => {
    this.props.blocks.setStatus('syncing');
    axios.delete(`/api/blocks/${blockId}`).then(() => {
      this.props.blocks.fetch();
    })
  }

  sortBlocks = ({ sourceIndex, destinationIndex, blocks }) => {
    const clonedBlocks = cloneDeep(blocks.data);
    const [removed] = clonedBlocks.splice(sourceIndex, 1);
    clonedBlocks.splice(destinationIndex, 0, removed);

    each(clonedBlocks, (item, index) => {
      item.sortOrder = index;
    });

    blocks.set(clonedBlocks, { setType: 'replace' });

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

  render() {
    return (
      <BlocksEditor
        blocks={this.getBlocksBySlide()}
        onDeleteBlockClicked={this.onDeleteBlockClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(BlocksEditorContainer, null, ['blocks']));