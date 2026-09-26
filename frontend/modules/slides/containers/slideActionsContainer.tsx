import React, { Component } from 'react';
import SlideActions from '../components/slideActions';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import getDoesSlideContainPrompts from '../helpers/getDoesSlideContainPrompts';


interface SlideActionsContainerProps {
  slides: {
    data: any,
    get: (getter: string) => any
  }
  router: any
}

class SlideActionsContainer extends Component<SlideActionsContainerProps> {

  onTurnOnFeedbackClicked = () => {
    console.log('Turn on feedback clicked');
  }

  render() {

    const slide = this.props.slides.get('active');

    const doesSlideContainPrompts = getDoesSlideContainPrompts({ slide });

    return (
      <SlideActions
        slide={slide}
        doesSlideContainPrompts={doesSlideContainPrompts}
        onTurnOnFeedbackClicked={this.onTurnOnFeedbackClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlideActionsContainer, {}, ['slides']));