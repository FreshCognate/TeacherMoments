import React, { Component } from 'react';
import ImagesBlockPlayer from '../components/imagesBlockPlayer';

class ImagesBlockPlayerContainer extends Component {
  state = {
    zoomedItem: null
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.state.zoomedItem) {
      this.setState({ zoomedItem: null });
    }
  }

  onImageClicked = (item) => {
    this.setState({ zoomedItem: item });
  }

  onZoomClosed = () => {
    this.setState({ zoomedItem: null });
  }

  render() {
    return (
      <ImagesBlockPlayer
        items={this.props.block.items}
        imagesShape={this.props.block.imagesShape}
        imagesBorderRadius={this.props.block.imagesBorderRadius}
        canClickToZoom={this.props.block.canClickToZoom}
        zoomedItem={this.state.zoomedItem}
        onImageClicked={this.onImageClicked}
        onZoomClosed={this.onZoomClosed}
      />
    );
  }
};

export default ImagesBlockPlayerContainer;
