import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class CreateNavigationContainer extends Component {

  state = {
    isCreating: false
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
      this.setState({ isCreating: false });
      handleRequestError(error);
    })
  }

  render() {
    const { isCreating } = this.state;
    return (
      <CreateNavigation
        slides={this.getCurrentStemOfSlides()}
        isCreating={isCreating}
        onAddSlideClicked={this.onAddSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'scenario']));