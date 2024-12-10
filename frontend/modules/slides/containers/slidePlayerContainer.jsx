import React, { Component } from 'react';
import SlidePlayer from '../components/slidePlayer';

class SlidePlayerContainer extends Component {
  render() {

    const { activeSlide, activeBlocks } = this.props;

    return (
      <SlidePlayer activeSlide={activeSlide} activeBlocks={activeBlocks} />
    );
  }
};

export default SlidePlayerContainer;