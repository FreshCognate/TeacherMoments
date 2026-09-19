import React, { Component } from 'react';
import registerField from '~/core/forms/helpers/registerField';
import ArrayFormField from '../components/array.formField';
import remove from 'lodash/remove';
import find from 'lodash/find';
import extend from 'lodash/extend';

class ArrayFormFieldContainer extends Component {

  sortArray = ({ sourceIndex, destinationIndex }) => {
    const [removed] = this.props.value.splice(sourceIndex, 1);
    this.props.value.splice(destinationIndex, 0, removed);
    this.props.updateField(this.props.value);
  }

  onUpdateItem = (itemId, { update }) => {
    const currentItem = find(this.props.value, { _id: itemId });
    extend(currentItem, update);
    this.props.updateField(this.props.value);
  }

  onAddItemClicked = (event) => {
    const target = event.currentTarget || event.target;
    let value = {};
    if (this.props.schema.getNewItemData) {
      value = this.props.schema.getNewItemData({ items: this.props.value });
    }
    this.props.value.push(value);
    this.props.updateField(this.props.value);
    setTimeout(() => {
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
  }

  onRemoveItemClicked = (itemId) => {
    remove(this.props.value, { _id: itemId });
    this.props.updateField(this.props.value);
  }

  onSortItemUpClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder - 1;
    this.sortArray({ sourceIndex, destinationIndex });
  }

  onSortItemDownClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder + 1;
    this.sortArray({ sourceIndex, destinationIndex });
  }

  render() {
    const { value, schema } = this.props;
    return (
      <ArrayFormField
        schema={schema}
        value={value}
        onUpdateItem={this.onUpdateItem}
        onAddItemClicked={this.onAddItemClicked}
        onRemoveItemClicked={this.onRemoveItemClicked}
        onSortItemUpClicked={this.onSortItemUpClicked}
        onSortItemDownClicked={this.onSortItemDownClicked}
      />
    );
  }
};

registerField('Array', ArrayFormFieldContainer);