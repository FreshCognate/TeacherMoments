import React, { Component } from 'react';
import BlocksEditor from '../components/blocksEditor';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';

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

  render() {
    return (
      <BlocksEditor
        blocks={this.getBlocksBySlide()}
        onDeleteBlockClicked={this.onDeleteBlockClicked}
      />
    );
  }
};

export default WithRouter(WithCache(BlocksEditorContainer, null, ['blocks']));