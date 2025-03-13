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
import handleRequestError from '~/core/app/helpers/handleRequestError';

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

  state = {
    isOptionsOpen: false,
    isDeleting: false
  }

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
    }).error(handleRequestError);
  }, 2000);

  onEditBlockUpdate = ({ update }) => {
    const blocks = getCache('blocks');
    blocks.setStatus('syncing');
    blocks.set(update, { setType: 'itemExtend', setFind: { _id: this.props.block._id } })
    this.debouncedSave({ update });
  }

  onToggleActionsClicked = (isOptionsOpen) => {
    this.setState({ isOptionsOpen })
  }

  onActionClicked = (action) => {
    this.setState({ isOptionsOpen: false });

    switch (action) {
      case 'DELETE':
        this.onDeleteBlockClicked();
        break;
    }
  }

  onDeleteBlockClicked = () => {
    this.setState({ isDeleting: true });
    axios.delete(`/api/blocks/${this.props.block._id}`).then(() => {
      this.props.blocks.fetch().then(() => {
        this.setState({ isDeleting: false });
      });
    }).catch((error) => {
      this.props.blocks.fetch();
      this.setState({ isDeleting: false });
      handleRequestError(error);
    })
  }

  render() {
    return (
      <EditBlock
        block={this.props.block}
        schema={this.getSchema()}
        isOptionsOpen={this.state.isOptionsOpen}
        isDeleting={this.state.isDeleting}
        onEditBlockUpdate={this.onEditBlockUpdate}
        onToggleActionsClicked={this.onToggleActionsClicked}
        onActionClicked={this.onActionClicked}
      />
    );
  }
};

export default WithRouter(WithCache(EditBlockContainer, null, ['blocks']));