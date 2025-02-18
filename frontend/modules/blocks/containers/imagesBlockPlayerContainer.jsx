import React, { Component } from 'react';
import ImagesBlockPlayer from '../components/imagesBlockPlayer';

class ImagesBlockPlayerContainer extends Component {
  render() {
    console.log(this.props);
    return (
      <ImagesBlockPlayer
        items={this.props.block.items}
      />
    );
  }
};

export default ImagesBlockPlayerContainer;