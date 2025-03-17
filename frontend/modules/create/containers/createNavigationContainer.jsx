import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getUrlDetails from '../helpers/getUrlDetails';
import find from 'lodash/find';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false,
    isDeleting: false,
    deletingId: null
  }

  getCurrentStemOfSlides = () => {
    return filter(this.props.slides.data, (slide) => {
      if (!slide.parentRef) return slide;
    })
  }

  getSelectedSlideSortOrder = () => {
    const { selectedSlideId } = getUrlDetails();
    return find(this.props.slides.data, { _id: selectedSlideId }).sortOrder;
  }

  onAddSlideClicked = () => {
    let parentRef;
    this.setState({ isCreating: true });
    const scenarioId = this.props.scenario.data._id;
    axios.post(`/api/slides`, {
      scenarioId: this.props.scenario.data._id,
      parentRef,
      sortOrder: this.getSelectedSlideSortOrder() + 1
    }).then((response) => {
      const slideId = response.data.slide._id;
      this.props.slides.fetch().then(() => {
        this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${slideId}`)
        this.setState({ isCreating: false });
      });
    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ isCreating: false });
      handleRequestError(error);
    })
  }

  onDeleteSlideClicked = (slideId) => {
    this.setState({ deletingId: slideId });
    axios.delete(`/api/slides/${slideId}`).then(() => {
      this.props.slides.fetch().then(() => {
        this.setState({ deletingId: null });
      });
    }).catch((error) => {
      this.props.slides.fetch();
      this.setState({ deletingId: null });
      handleRequestError(error);
    })
  }

  render() {
    const { isCreating, deletingId } = this.state;
    const { selectedSlideId } = getUrlDetails();
    return (
      <CreateNavigation
        scenarioId={this.props.scenario.data._id}
        slides={this.getCurrentStemOfSlides()}
        blocks={this.props.blocks.data}
        selectedSlideId={selectedSlideId}
        isCreating={isCreating}
        deletingId={deletingId}
        onAddSlideClicked={this.onAddSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'blocks', 'scenario']));