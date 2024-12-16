import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';
import navigateTo from '~/modules/tracking/helpers/navigateTo';

class SlidePlayerContainer extends Component {

  onUpdateTracking = ({ blockRef, update }) => {
    return updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  navigateTo = ({ slideRef }) => {
    return navigateTo({ slideRef });
  }

  render() {

    const { activeSlide, activeBlocks } = this.props;

    return (
      <SlidePlayer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        onUpdateTracking={this.onUpdateTracking}
        navigateTo={this.navigateTo}
      />
    );
  }
};

export default SlidePlayerContainer;