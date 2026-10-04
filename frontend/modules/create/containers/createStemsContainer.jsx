import React, { Component } from 'react';
import CreateStems from '../components/createStems';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import addModal from '~/core/dialogs/helpers/addModal';
import filter from 'lodash/filter';
import WithRouter from '~/core/app/components/withRouter';
import getScenarioDetails from '~/modules/run/helpers/getScenarioDetails';

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
    return filter(this.props.stems.data, { slideRef: this.props.slideRef });
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
          this.props.slides.fetch();
          this.props.blocks.fetch();
          this.props.triggers.fetch();
        }).catch((error) => {
          this.setState({ deletingId: null });
          handleRequestError(error);
        });
      }
    });
  }

  onCreateStemClicked = () => {
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    const { activeSlideRef } = getScenarioDetails();
    console.log('creating a stem clicked');

    return;
    axios.post('/api/stems', {
      scenarioId,
      slideRef: activeSlideRef
    }).then((response) => {
      const newStem = response.data.stem;
      Promise.all([
        this.props.stems.fetch(),
        this.props.slides.fetch()
      ]).then(() => {
        this.props.editor.set({ activeStemRef: newStem.ref });
        const slidesCache = getCache('slides');
        const stemSlides = filter(slidesCache.data, { stemRef: newStem.ref });
        if (stemSlides.length > 0) {
          this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${stemSlides[0]._id}`, {
            replace: true
          });
        }
        this.setState({ isCreating: false });
      });
    }).catch((error) => {
      this.setState({ isCreating: false });
      handleRequestError(error);
    });
  }

  render() {
    const { isCreating, deletingId } = this.state;
    const childStems = this.getChildStems();
    const activeStemRef = this.getActiveStemRef();
    return (
      <CreateStems
        activeStemRef={activeStemRef}
        childStems={childStems}
        isCreating={isCreating}
        deletingId={deletingId}
        onEditStemClicked={this.onEditStemClicked}
        onDeleteStemClicked={this.onDeleteStemClicked}
        onStemClicked={this.onStemClicked}
        onCreateStemClicked={this.onCreateStemClicked}
      />
    );
  }
}

export default WithRouter(WithCache(CreateStemsContainer, null, ['stems', 'scenario', 'slides', 'blocks', 'editor', 'triggers']));
