import React, { Component } from 'react';
import EditBlock from '../components/editBlock';
import debounce from 'lodash/debounce';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import editTextBlockSchema from '../schemas/editTextBlockSchema';
import editMultipleChoicePromptBlockSchema from '../schemas/editMultipleChoicePromptBlockSchema';
import editInputPromptBlockSchema from '../schemas/editInputPromptBlockSchema';
import editActionsPromptBlockSchema from '../schemas/editActionsPromptBlockSchema';
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
  MULTIPLE_CHOICE_PROMPT: editMultipleChoicePromptBlockSchema,
  INPUT_PROMPT: editInputPromptBlockSchema,
  ACTIONS_PROMPT: editActionsPromptBlockSchema
}

class EditBlockContainer extends Component {

  state = {
    isOptionsOpen: false,
    isDeleting: false,
    renderKey: 0,
  }

  isSaving = false;

  getSchemas = () => {
    let currentBlockSchema = {};

    if (this.props.block && SCHEMA_MAPPINGS[this.props.block.blockType]) {
      currentBlockSchema = SCHEMA_MAPPINGS[this.props.block.blockType];
    }

    return currentBlockSchema;
  }

  debouncedSave = debounce(({ update }) => {
    this.isSaving = true;
    axios.put(`/api/blocks/${this.props.block._id}`, update).then(() => {
      const { blocks } = this.props;
      blocks.fetch();
    }).catch(handleRequestError);
  }, 2000);

  getSortingDetails = () => {
    let canSortUp = false;
    let canSortDown = false;

    if (this.props.block.sortOrder !== 0) {
      canSortUp = true;
    }

    if (this.props.block.sortOrder < this.props.blocksLength - 1) {
      canSortDown = true;
    }

    return {
      canSortUp,
      canSortDown
    }
  }

  onEditBlockUpdate = ({ update }) => {
    const { blocks } = this.props;
    blocks.setStatus('syncing');
    blocks.set(update, { setType: 'itemExtend', setFind: { _id: this.props.block._id } });
    this.setState({ renderKey: this.state.renderKey + 1 });
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
    const { canSortUp, canSortDown } = this.getSortingDetails();
    const { contentSchema, settingsSchema } = this.getSchemas()
    const { renderKey } = this.state;
    return (
      <EditBlock
        renderKey={renderKey}
        block={this.props.block}
        contentSchema={contentSchema}
        settingsSchema={settingsSchema}
        canSortUp={canSortUp}
        canSortDown={canSortDown}
        isOptionsOpen={this.state.isOptionsOpen}
        isDeleting={this.state.isDeleting}
        onEditBlockUpdate={this.onEditBlockUpdate}
        onToggleActionsClicked={this.onToggleActionsClicked}
        onActionClicked={this.onActionClicked}
        onSortUpClicked={this.props.onSortUpClicked}
        onSortDownClicked={this.props.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(EditBlockContainer, null, ['blocks']));