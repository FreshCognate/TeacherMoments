import React, { Component } from 'react';
import TriggerBlocksSelector from '../components/triggerBlocksSelector.formField';
import registerField from '~/core/forms/helpers/registerField';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class TriggerBlocksSelectorContainer extends Component {

  getFilteredBlocks = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    const currentSlide = find(this.props.slides.data, { _id: slideId });
    return filter(this.props.blocks.data, (block) => {
      if (block.slideRef === currentSlide.ref) {
        const { blockTypes } = this.props.schema;
        if (blockTypes && blockTypes.length > 0) {
          if (includes(blockTypes, block.blockType)) {
            return block;
          }
        } else {
          return block;
        }
      }
    })
  }

  onBlockToggled = (blockRef) => {
    const clonedBlocks = cloneDeep(this.props.value);
    if (includes(clonedBlocks, blockRef)) {
      pull(clonedBlocks, blockRef);
    } else {
      clonedBlocks.push(blockRef);
    }
    this.props.updateField(clonedBlocks);
  }

  render() {
    return (
      <TriggerBlocksSelector
        blocks={this.getFilteredBlocks()}
        value={this.props.value}
        onBlockToggled={this.onBlockToggled}
      />
    );
  }
};

registerField('TriggerBlocksSelector', WithRouter(WithCache(TriggerBlocksSelectorContainer, null, ['slides', 'blocks'])));