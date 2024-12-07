import React, { Component } from 'react';
import DialogPanel from '../components/dialogPanel';
import WithCache from '~/core/cache/containers/withCache';

class DialogPanelContainer extends Component {
  render() {
    return (
      <DialogPanel
        panel={this.props.panel}
        page={this.props.page.data}
        section={this.props.section.data}
        interaction={this.props.interaction.data}
      />
    );
  }
};

export default WithCache(DialogPanelContainer, {}, ['editor', 'page', 'section', 'interaction']);