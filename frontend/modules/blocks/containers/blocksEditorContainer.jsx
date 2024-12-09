import React, { Component } from 'react';
import BlocksEditor from '../components/blocksEditor';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';

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

  render() {
    return (
      <BlocksEditor
        blocks={this.getBlocksBySlide()}
      />
    );
  }
};

export default WithRouter(WithCache(BlocksEditorContainer, null, ['blocks']));