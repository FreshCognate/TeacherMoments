import React, { Component } from 'react';
import BlockSelector from '../components/blockSelector';
import WithRouter from '~/core/app/components/withRouter';
import getCache from '~/core/cache/helpers/getCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import find from 'lodash/find';
import blocks from '../../../../config/blocks.json';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';

class BlockSelectorContainer extends Component {

  getBlocks = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    const slides = getCache('slides');
    const slide = find(slides.data, { _id: slideId });
    const clonedBlocks = cloneDeep(blocks);
    if (slide.isRoot) {
      remove(clonedBlocks, (block) => {
        if (block.blockType === 'RESPONSE') return true;
      })
    }
    return clonedBlocks;
  }

  onAddBlockTypeClicked = (blockType) => {
    this.props.actions.onCloseButtonClicked();
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    const slides = getCache('slides');
    const slide = find(slides.data, { _id: slideId });
    if (slide) {
      const scenario = getCache('scenario')
      const scenarioId = scenario.data._id;
      axios.post(`/api/blocks`, { blockType, slideRef: slide.ref, scenarioId }).then(() => {
        const blocks = getCache('blocks');
        blocks.fetch();
      }).catch(handleRequestError);
    }
  }

  render() {
    return (
      <BlockSelector
        blocks={this.getBlocks()}
        onAddBlockTypeClicked={this.onAddBlockTypeClicked}
      />
    );
  }
};

export default WithRouter(BlockSelectorContainer);