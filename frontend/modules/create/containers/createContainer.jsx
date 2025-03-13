import React, { Component } from 'react';
import Create from '../components/create';
import sortSlides from '../helpers/sortSlides';

class CreateContainer extends Component {

  onDragOver = () => {
    return;
  }

  onDragStart = () => {
    return;
  }

  onDragEnd = async (event) => {
    const { active, over } = event;
    const { type: activeType } = active.data.current;

    if (activeType === 'SLIDES') {
      const { type: overType } = over?.data?.current || {};
      if (overType === 'SLIDES') {
        sortSlides({ active, over });
      }
      return;
    }
  };

  render() {
    return (
      <Create
        onDragOver={this.onDragOver}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      />
    );
  }
};

export default CreateContainer;