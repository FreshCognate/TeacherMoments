import React, { Component } from 'react';
import CreateStems from '../components/createStems';
import WithCache from '~/core/cache/containers/withCache';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
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

  onCreateStemClicked = () => {
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    const activeStemRef = this.getActiveStemRef();
    axios.post('/api/stems', {
      scenarioId,
      stemRef: activeStemRef
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

  onDeleteStemClicked = (stemId) => {
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

  render() {
    const { isCreating, deletingId } = this.state;
    const childStems = this.getChildStems();
    return (
      <CreateStems
        childStems={childStems}
        isCreating={isCreating}
        deletingId={deletingId}
        getSlideCountForStem={this.getSlideCountForStem}
        onCreateStemClicked={this.onCreateStemClicked}
        onDeleteStemClicked={this.onDeleteStemClicked}
        onStemClicked={this.onStemClicked}
      />
    );
  }
}

export default WithRouter(WithCache(CreateStemsContainer, null, ['stems', 'scenario', 'slides', 'editor']));
