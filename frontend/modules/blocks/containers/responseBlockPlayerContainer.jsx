import React, { Component } from 'react';
import ResponseBlockPlayer from '../components/responseBlockPlayer';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';
import findSlideTracking from '~/modules/tracking/helpers/findSlideTracking';

class ResponseBlockPlayerContainer extends Component {

  getResponse = () => {
    let hasError = false;
    let error;
    let response;
    let block;
    let blockTracking;
    let blockType;
    if (!this.props.block.responseRef) {
      hasError = true;
      error = "A response has not been chosen.";
    } else if (this.props.block.responseType === 'PROMPT') {

      const blocks = getCache('blocks');
      block = find(blocks.data, { ref: this.props.block.responseRef });
      const slideTracking = findSlideTracking({ slideRef: block.slideRef });

      if (slideTracking) {
        blockTracking = slideTracking.blocksByRef[this.props.block.responseRef];
        blockType = block.blockType;
      } else {
        hasError = true;
        error = "Slide tracking is missing.";
      }
    }
    return { hasError, error, block, blockTracking, blockType };
  }

  render() {
    const { hasError, error, block, blockTracking, blockType } = this.getResponse();
    return (
      <ResponseBlockPlayer
        block={block}
        blockTracking={blockTracking}
        blockType={blockType}
        hasError={hasError}
        error={error}
      />
    );
  }
};

export default ResponseBlockPlayerContainer;