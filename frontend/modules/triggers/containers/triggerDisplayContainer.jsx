import React, { Component } from 'react';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import TriggersEditorContainer from './triggersEditorContainer';
import getEventDescription from '../helpers/getEventDescription';
import TriggerDisplay from '../components/triggerDisplay';

class TriggerDisplayContainer extends Component {

  onOpenTriggerPanelClicked = () => {
    addSidePanel({
      position: 'right',
      component: <TriggersEditorContainer elementRef={this.props.elementRef} event={this.props.event} triggerType={this.props.triggerType} />
    })
  }

  render() {
    const { event, triggerType } = this.props;
    return (
      <TriggerDisplay
        eventDescription={getEventDescription({ event, triggerType })}
        onOpenTriggerPanelClicked={this.onOpenTriggerPanelClicked}
      />
    );
  }
};

export default TriggerDisplayContainer;