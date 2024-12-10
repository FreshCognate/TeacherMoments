import React, { Component } from 'react';
import DialogPanel from '../components/dialogPanel';
import WithCache from '~/core/cache/containers/withCache';

class DialogPanelContainer extends Component {
  render() {
    return (
      <DialogPanel
        panel={this.props.panel}
      />
    );
  }
};

export default WithCache(DialogPanelContainer, {}, []);