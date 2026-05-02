import React, { Component } from 'react';
import CreateStems from '../components/createStems';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import addModal from '~/core/dialogs/helpers/addModal';
import getCache from '~/core/cache/helpers/getCache';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';

class CreateStemsContainer extends Component {

  state = {
    isCreating: false,
    deletingId: null
  }

  getActiveStemRef = () => {
    return this.props.editor.data.activeStemRef;
  }

  getChildStems = () => {
    const activeStemRef = this.getActiveStemRef();
    if (!activeStemRef) return [];
    return filter(this.props.stems.data, { stemRef: activeStemRef });
  }

  getSlideCountForStem = (stemRef) => {
    return filter(this.props.slides.data, { stemRef }).length;
  }

  onStemClicked = (stemRef) => {
    this.props.editor.set({ activeStemRef: stemRef });
    const stemSlides = filter(this.props.slides.data, { stemRef });
    if (stemSlides.length > 0) {
      const scenarioId = this.props.scenario.data._id;
      this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${stemSlides[0]._id}`, {
        replace: true
      });
    }
  }

  onEditStemClicked = (stem) => {
    addModal({
      title: 'Edit stem',
      schema: {
        name: {
          type: 'Text',
          label: 'Name',
          shouldAutoFocus: true
        },
        description: {
          type: 'TextArea',
          label: 'Description',
          features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
        }
      },
      model: {
        name: stem.name,
        description: stem.description
      },
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'SAVE',
        text: 'Save',
        color: 'primary'
      }]
    }, (state, { type, modal }) => {
      if (state === 'ACTION' && type === 'SAVE') {
        axios.put(`/api/stems/${stem._id}`, modal).then(() => {
          this.props.stems.fetch();
        }).catch(handleRequestError);
      }
    });
  }

  onDeleteStemClicked = (stemId) => {
    addModal({
      title: 'Delete stem',
      description: 'Are you sure you want to delete this stem? All slides in this stem and child stems will be removed.',
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }, {
        type: 'DELETE',
        text: 'Delete',
        color: 'danger'
      }]
    }, (state, { type }) => {
      if (state === 'ACTION' && type === 'DELETE') {
        this.setState({ deletingId: stemId });
        axios.delete(`/api/stems/${stemId}`).then(() => {
          this.props.stems.fetch().then(() => {
            this.setState({ deletingId: null });
          });
        }).catch((error) => {
          this.setState({ deletingId: null });
          handleRequestError(error);
        });
      }
    });
  }

  render() {
    const { isCreating, deletingId } = this.state;
    const childStems = this.getChildStems();
    return (
      <CreateStems
        childStems={childStems}
        isCreating={isCreating}
        deletingId={deletingId}
        getSlideCountForStem={this.getSlideCountForStem}
        onEditStemClicked={this.onEditStemClicked}
        onDeleteStemClicked={this.onDeleteStemClicked}
        onStemClicked={this.onStemClicked}
      />
    );
  }
}

export default WithRouter(WithCache(CreateStemsContainer, null, ['stems', 'scenario', 'slides', 'editor']));
