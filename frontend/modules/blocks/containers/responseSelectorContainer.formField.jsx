import React, { Component } from 'react';
import registerField from '~/core/forms/helpers/registerField';
import ResponseSelector from '../components/responseSelector';
import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';
import includes from 'lodash/includes';
import getPromptBlocksBySlideRef from '../helpers/getPromptBlocksBySlideRef';
import getBlockDisplayName from '../helpers/getBlockDisplayName';
import getString from '~/modules/ls/helpers/getString';


class ResponseSelectorContainerFormField extends Component {

  getAvailablePromptResponses = (slide) => {
    let responses = [];

    const getResponsesBySlide = (slide) => {
      const blocks = getPromptBlocksBySlideRef({ slideRef: slide.ref });
      for (const block of blocks) {
        const blockDisplayName = getBlockDisplayName(block);
        responses.push({
          slideName: slide.name,
          slideRef: slide.ref,
          blockType: block.blockType,
          blockRef: block.ref,
          blockDisplayName,
          blockPrompt: getString({ model: block, field: 'body' })
        })
      }
    }
    getResponsesBySlide(slide);
    const doesSlideContainCurrentBlocksSlide = includes(slide.children, this.props.model.slideRef);
    if (!doesSlideContainCurrentBlocksSlide) {
      for (const childSlideRef of slide.children) {
        const slides = getCache('slides');
        const slide = find(slides.data, { ref: childSlideRef });
        getResponsesBySlide(slide);
      }
    }
    return responses;
  }

  getAvailableResponses = () => {
    let hasError = false;
    let error;
    let responses = [];
    if (this.props.model.responseType === 'PROMPT') {

      const slides = getCache('slides');

      const rootSlide = find(slides.data, { isRoot: true });

      if (rootSlide.ref === this.props.model.slideRef) {
        hasError = true;
        error = 'Cannot use a response block on the first slide.';
      } else {
        responses = this.getAvailablePromptResponses(rootSlide);
      }
    }
    console.log(responses);
    return { hasError, error, responses };
  }

  onResponseClicked = (ref) => {
    this.props.updateField(ref);
  }

  render() {
    const { hasError, error, responses } = this.getAvailableResponses();
    return (
      <ResponseSelector
        hasError={hasError}
        error={error}
        responses={responses}
        value={this.props.value}
        onResponseClicked={this.onResponseClicked}
      />
    );
  }
};

export default registerField('ResponseSelector', ResponseSelectorContainerFormField);