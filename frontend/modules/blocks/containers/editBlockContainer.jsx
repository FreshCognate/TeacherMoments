import React, { Component } from 'react';
import EditBlock from '../components/editBlock';
import find from 'lodash/find';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editBlockSchema from '../schemas/editBlockSchema';
import editTextBlockSchema from '../schemas/editTextBlockSchema';
import editInputBlockSchema from '../schemas/editInputBlockSchema';

const SCHEMA_MAPPINGS = {
  TEXT: editTextBlockSchema,
  INPUT: editInputBlockSchema
}

class EditBlockContainer extends Component {

  getSchema = () => {
    let currentBlockSchema = {};

    const { data } = this.props.block;

    if (data && SCHEMA_MAPPINGS[data.blockType]) {
      currentBlockSchema = SCHEMA_MAPPINGS[data.blockType];
    }

    return {
      ...editBlockSchema,
      ...currentBlockSchema
    }
  }

  onEditBlockUpdate = ({ update }) => {
    const blocks = getCache('blocks');
    blocks.setStatus('syncing');
    blocks.set(update, { setType: 'itemExtend', setFind: { _id: this.props.block.data._id } })
    this.props.block.mutate(update, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const blocks = getCache('blocks');
        blocks.fetch();
      }
    });
  }

  render() {
    const { block } = this.props;
    return (
      <EditBlock
        block={block.data}
        schema={this.getSchema()}
        onEditBlockUpdate={this.onEditBlockUpdate}
      />
    );
  }
};

export default WithCache(EditBlockContainer, {
  block: {
    url: '/api/blocks/:id',
    transform: ({ data }) => data.block,
    getParams: ({ props }) => {
      return {
        id: props.blockId
      }
    },
    getInitialData: ({ props }) => {
      const blocks = getCache('blocks');
      const currentBlock = find(blocks.data, { _id: props.blockId });
      return currentBlock;
    }
  }
});