import React, { Component } from 'react';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import TriggersEditorContainer from './triggersEditorContainer';
import getEventDescription from '../helpers/getEventDescription';
import TriggerDisplay from '../components/triggerDisplay';
import WithCache from '~/core/cache/containers/withCache';
import filter from 'lodash/filter';

class TriggerDisplayContainer extends Component {

  getTriggersCount = () => {
    const { data } = this.props.triggers;
    return filter(data, (trigger) => trigger.elementRef === this.props.elementRef && trigger.event === this.props.event).length;
  }

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
        triggersCount={this.getTriggersCount()}
        onOpenTriggerPanelClicked={this.onOpenTriggerPanelClicked}
      />
    );
  }
};

export default WithCache(TriggerDisplayContainer, null, ['triggers']);