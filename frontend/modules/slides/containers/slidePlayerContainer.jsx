import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import navigateTo from '~/modules/tracking/helpers/navigateTo';
import trigger from '~/modules/triggers/helpers/trigger';
import getSlideTracking from '~/modules/tracking/helpers/getSlideTracking';
import WithCache from '~/core/cache/containers/withCache';

class SlidePlayerContainer extends Component {

  state = {
    isLoading: true
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.activeSlide !== prevProps.activeSlide) {
      trigger({ triggerType: 'SLIDE', event: 'ON_ENTER', elementRef: this.props.activeSlide.ref }, {}).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }

  onUpdateTracking = async ({ blockRef, update }) => {
    await updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  render() {

    const { activeSlide, activeBlocks } = this.props;

    const slideTracking = getSlideTracking();

    return (
      <SlidePlayer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        isLoading={this.state.isLoading}
        onUpdateTracking={this.onUpdateTracking}
        navigateTo={this.navigateTo}
        tracking={slideTracking}
      />
    );
  }
};

export default WithCache(SlidePlayerContainer, null, ['tracking']);