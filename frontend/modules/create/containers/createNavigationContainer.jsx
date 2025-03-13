import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getUrlDetails from '../helpers/getUrlDetails';

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

  onAddSlideClicked = () => {
    let parentRef;
    this.setState({ isCreating: true });
    axios.post(`/api/slides`, {
      scenarioId: this.props.scenario.data._id,
      parentRef,
      sortOrder: this.getCurrentStemOfSlides().length
    }).then(() => {
      this.props.slides.fetch();
      this.setState({ isCreating: false });
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