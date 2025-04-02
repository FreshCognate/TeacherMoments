import React, { Component } from 'react';
import ResponseBlockPlayer from '../components/responseBlockPlayer';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';
import findSlideStage from '~/modules/run/helpers/findSlideStage';

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
    } else {

      const blocks = getCache('blocks');
      block = find(blocks.data, { ref: this.props.block.responseRef });
      const slideStage = findSlideStage({ slideRef: block.slideRef });

      if (slideStage) {
        blockTracking = slideStage.blocksByRef[this.props.block.responseRef];
        blockType = block.blockType;
      } else {
        hasError = true;
        error = "Slide run is missing.";
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