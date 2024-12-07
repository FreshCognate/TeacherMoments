import React, { Component } from 'react';
import DialogProgress from '../components/dialogProgress';
import WithCache from '~/core/cache/containers/withCache';

class DialogProgressContainer extends Component {
  render() {
    return (
      <DialogProgress
        items={this.props.dialogProgressItems.data}
        onCloseButtonClicked={this.props.onCloseButtonClicked}
      />
    );
  }
};

export default WithCache(DialogProgressContainer, null, ['dialogProgressItems']);