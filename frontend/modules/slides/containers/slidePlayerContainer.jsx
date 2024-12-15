import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';
import updateTracking from '~/modules/tracking/helpers/updateTracking';

class SlidePlayerContainer extends Component {

  onUpdateTracking = ({ blockRef, update }) => {
    return updateTracking({ slideRef: this.props.activeSlide.ref, blockRef, update });
  }

  render() {

    const { activeSlide, activeBlocks } = this.props;

    return (
      <SlidePlayer
        activeSlide={activeSlide}
        activeBlocks={activeBlocks}
        onUpdateTracking={this.onUpdateTracking}
      />
    );
  }
};

export default SlidePlayerContainer;