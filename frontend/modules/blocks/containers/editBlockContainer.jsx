import React, { Component } from 'react';
import EditBlock from '../components/editBlock';
import debounce from 'lodash/debounce';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editBlockSchema from '../schemas/editBlockSchema';
import editTextBlockSchema from '../schemas/editTextBlockSchema';
import editAnswersPromptBlockSchema from '../schemas/editAnswersPromptBlockSchema';
import editInputPromptBlockSchema from '../schemas/editInputPromptBlockSchema';
import editActionsPromptBlockSchema from '../schemas/editActionsPromptBlockSchema';
import WithRouter from '~/core/app/components/withRouter';
import editImagesBlockSchema from '../schemas/editImagesBlockSchema';
import editMediaBlockSchema from '../schemas/editMediaBlockSchema';
import editSuggestionBlockSchema from '../schemas/editSuggestionBlockSchema';
import editResponseBlockSchema from '../schemas/editResponseBlockSchema';
import axios from 'axios';

const SCHEMA_MAPPINGS = {
  TEXT: editTextBlockSchema,
  IMAGES: editImagesBlockSchema,
  MEDIA: editMediaBlockSchema,
  SUGGESTION: editSuggestionBlockSchema,
  RESPONSE: editResponseBlockSchema,
  ANSWERS_PROMPT: editAnswersPromptBlockSchema,
  INPUT_PROMPT: editInputPromptBlockSchema,
  ACTIONS_PROMPT: editActionsPromptBlockSchema
}

class EditBlockContainer extends Component {
  isSaving = false;

  getSchema = () => {
    let currentBlockSchema = {};

    if (this.props.block && SCHEMA_MAPPINGS[this.props.block.blockType]) {
      currentBlockSchema = SCHEMA_MAPPINGS[this.props.block.blockType];
    }

    return {
      ...editBlockSchema,
      ...currentBlockSchema
    }
  }

  debouncedSave = debounce(({ update }) => {
    this.isSaving = true;
    axios.put(`/api/blocks/${this.props.block._id}`, update).then(() => {
      const blocks = getCache('blocks');
      blocks.fetch();
    });
  }, 2000);

  onEditBlockUpdate = ({ update }) => {
    const blocks = getCache('blocks');
    blocks.setStatus('syncing');
    blocks.set(update, { setType: 'itemExtend', setFind: { _id: this.props.block._id } })
    this.debouncedSave({ update });
  }

  render() {
    return (
      <EditBlock
        block={this.props.block}
        schema={this.getSchema()}
        onEditBlockUpdate={this.onEditBlockUpdate}
      />
    );
  }
};

export default WithRouter(WithCache(EditBlockContainer, null, ['blocks']));