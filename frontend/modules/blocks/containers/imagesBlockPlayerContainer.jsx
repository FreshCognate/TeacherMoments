import React, { Component } from 'react';
import ImagesBlockPlayer from '../components/imagesBlockPlayer';

class ImagesBlockPlayerContainer extends Component {
  render() {
    return (
      <ImagesBlockPlayer
        items={this.props.block.items}
        imagesShape={this.props.block.imagesShape}
        imagesBorderRadius={this.props.block.imagesBorderRadius}
      />
    );
  }
};

export default ImagesBlockPlayerContainer;