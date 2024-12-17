import React, { Component } from 'react';
import TriggersPanel from '../components/triggersPanel';
import WithRouter from '~/core/app/components/withRouter';

class TriggersPanelContainer extends Component {

  state = {
    slideEvent: 'ON_INIT',
    blockEvent: 'ON_SHOW'
  }

  getSelectedType = () => {
    const params = new URLSearchParams(this.props.router.location.search);
    const blockId = params.get('block');
    if (blockId) return 'BLOCK';
    return 'SLIDE';
  }

  render() {
    const selectedType = this.getSelectedType();

    return (
      <TriggersPanel
        selectedType={selectedType}
        slideEvent={this.state.slideEvent}
        blockEvent={this.state.blockEvent}
      />
    );
  }
};

export default WithRouter(TriggersPanelContainer);