import React, { Component } from 'react';
import EditBlock from '../components/editBlock';
import find from 'lodash/find';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editBlockSchema from '../schemas/editBlockSchema';
import editTextBlockSchema from '../schemas/editTextBlockSchema';
import editAnswersPromptBlockSchema from '../schemas/editAnswersPromptBlockSchema';
import editActionsBlockSchema from '../schemas/editActionsBlockSchema';
import getSlideSelectionFromQuery from '~/modules/scenarioBuilder/helpers/getSlideSelectionFromQuery';
import getEditingDetailsFromQuery from '~/modules/scenarioBuilder/helpers/getEditingDetailsFromQuery';
import WithRouter from '~/core/app/components/withRouter';

const SCHEMA_MAPPINGS = {
  TEXT: editTextBlockSchema,
  ANSWERS_PROMPT: editAnswersPromptBlockSchema,
  ACTIONS: editActionsBlockSchema
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

  onCloseEditorClicked = () => {
    const { router } = this.props;
    const searchParams = new URLSearchParams(router.location.search);
    const slideId = searchParams.get('slide');
    const slideSelection = getSlideSelectionFromQuery();
    const { isEditing, layer } = getEditingDetailsFromQuery();
    router.navigate(`/scenarios/${router.params.id}/create?slideSelection=${JSON.stringify(slideSelection)}&isEditing=${isEditing}&layer=${layer}&slide=${slideId}`, { replace: true });
  }

  render() {
    const { block } = this.props;
    return (
      <EditBlock
        block={block.data}
        schema={this.getSchema()}
        onCloseEditorClicked={this.onCloseEditorClicked}
        onEditBlockUpdate={this.onEditBlockUpdate}
      />
    );
  }
};

export default WithRouter(WithCache(EditBlockContainer, {
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
}));