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

  getAvailablePromptResponses = () => {
    let responses = [];
    const slides = getCache('slides');
    const currentSlide = find(slides.data, { ref: this.props.model.slideRef });
    const currentSlideSortOrder = currentSlide.sortOrder;

    for (const slide of slides.data) {
      if (slide.sortOrder < currentSlideSortOrder) {
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
    }
    return responses;
  }

  getAvailableResponses = () => {
    let hasError = false;
    let error;
    let responses = [];

    const slides = getCache('slides');

    const rootSlide = find(slides.data, { sortOrder: 0 });

    if (rootSlide.ref === this.props.model.slideRef) {
      hasError = true;
      error = 'Cannot use a response block on the first slide.';
    } else {
      responses = this.getAvailablePromptResponses();
    }

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