import React, { Component } from 'react';
import CreateDroppable from '../components/createDroppable';

class CreateDroppableContainer extends Component {
  render() {
    const { id, items, renderItem, data } = this.props;
    return (
      <CreateDroppable id={id} items={items} data={data} renderItem={renderItem} />
    );
  }
};

export default CreateDroppableContainer;