import React, { Component } from 'react';
import CreateNavigation from '../components/createNavigation';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';

class CreateNavigationContainer extends Component {

  getCurrentStemOfSlides = () => {
    return filter(this.props.slides.data, (slide) => {
      if (!slide.parentRef) return slide;
    })
  }

  render() {
    console.log(this.props.slides);
    return (
      <CreateNavigation
        slides={this.getCurrentStemOfSlides()}
      />
    );
  }
};

export default WithRouter(WithCache(CreateNavigationContainer, null, ['slides', 'scenario']));