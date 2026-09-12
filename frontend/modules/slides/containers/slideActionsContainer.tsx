import React, { Component } from 'react';
import SlideActions from '../components/slideActions';
import addSidePanel from '~/core/dialogs/helpers/addSidePanel';
import TriggerDisplayContainer from '~/modules/triggers/containers/triggerDisplayContainer';
import addModal from '~/core/dialogs/helpers/addModal';
import BlockSelectorContainer from '~/modules/blocks/containers/blockSelectorContainer';
import getCache from '~/core/cache/helpers/getCache';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import find from 'lodash/find';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';
import { Block } from '~/modules/blocks/blocks.types';
import { Trigger } from '~/modules/triggers/triggers.types';


interface SlideActionsContainerProps {
  router: any
}

class SlideActionsContainer extends Component<SlideActionsContainerProps> {

  onOpenTriggersClicked = () => {
    addSidePanel({
      size: 'lg',
      icon: 'trigger',
      title: 'Triggers',
      component: <TriggerDisplayContainer />
    })
  }

  onCreateBlockClicked = () => {
    addModal({
      title: 'Choose a block type to add to your slide:',
      component: <BlockSelectorContainer />,
      actions: [{
        type: 'CANCEL',
        text: 'Cancel'
      }]
    }, () => { })
  }

  render() {
    let blocks: Block[] = [];
    let triggers: Trigger[] = [];
    const slides = getCache('slides');
    if (slides.data) {
      const searchParams = new URLSearchParams(this.props.router.location.search);
      const slideId = searchParams.get('slide');

      const slide = find(slides.data, { _id: slideId })
      if (slide) {
        const slideRef = slide.ref;
        blocks = getBlocksBySlideRef({ slideRef });
        triggers = getTriggersBySlideRef({ slideRef });
      }
    }
    return (
      <SlideActions
        blocks={blocks}
        triggers={triggers}
        onOpenTriggersClicked={this.onOpenTriggersClicked}
        onCreateBlockClicked={this.onCreateBlockClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlideActionsContainer));