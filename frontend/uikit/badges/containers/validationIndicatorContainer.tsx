import React, { Component } from 'react';
import ValidationIndicatorErrors from '../components/validationIndicatorErrors';
import { ValidationError } from '../components/validationIndicator';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';

interface Props {
  errors?: any;
  slides: any;
  blocks: any;
  router: any;
  onClose: () => void;
}

class ValidationIndicatorContainer extends Component<Props> {

  onErrorClicked = (error: ValidationError) => {
    const { id: scenarioId } = this.props.router.params;
    switch (error.elementType) {
      case 'SLIDE': {
        const currentSlide = find(this.props.slides.data, { _id: error.elementId });
        if (currentSlide) {
          this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${error.elementId}`);
          const editor = getCache('editor');
          editor.set({ activeStemRef: currentSlide.stemRef });
          this.props.onClose();
        }
        break;
      }
      case 'BLOCK': {
        const currentBlock = find(this.props.blocks.data, { _id: error.elementId });
        if (currentBlock) {
          const currentSlide = find(this.props.slides.data, { ref: currentBlock.slideRef });
          if (currentSlide) {
            this.props.router.navigate(`/scenarios/${scenarioId}/create?slide=${currentSlide._id}`);
            const editor = getCache('editor');
            editor.set({ activeStemRef: currentSlide.stemRef });
            this.props.onClose();
            setTimeout(() => {
              const blockElement = document.getElementById(`block-${currentBlock._id}`);
              const container = document.getElementById('create-workspace-container');
              if (blockElement && container) {
                container.scrollTo({
                  top: blockElement.offsetTop - container.offsetTop,
                  behavior: 'smooth'
                });
                blockElement.classList.add('validation-highlight');
                blockElement.addEventListener('animationend', () => {
                  blockElement.classList.remove('validation-highlight');
                }, { once: true });
              }
            }, 300);
          }
        }
        break;
      }
    }
  }

  render() {
    return (
      <ValidationIndicatorErrors
        errors={this.props.errors}
        onErrorClicked={this.onErrorClicked}
      />
    );
  }
};

export default WithRouter(WithCache(ValidationIndicatorContainer, {}, ['blocks', 'slides']));