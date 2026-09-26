import React, { Component } from 'react';
import EditSlideFeedback from '../components/editSlideFeedback';
import WithCache from '~/core/cache/containers/withCache';
import { Slide } from '../slides.types';
import editSlideFeedbackSchema from '../schemas/editSlideFeedbackSchema';
import getCache from '~/core/cache/helpers/getCache';

interface EditSlideFeedbackContainerProps {
  slide: {
    data: Slide,
    mutate: (
      update: Partial<Slide>,
      options: { method: string },
      callback: (status: string) => void
    ) => void
  }
}

class EditSlideFeedbackContainer extends Component<EditSlideFeedbackContainerProps> {
  onSlideUpdate = ({ update }: { update: Partial<Slide> }) => {
    // @color: Why does this fail. It seems it is not putting the slide._id into the params when making the request
    this.props.slide.mutate(update, { method: 'put' }, (status: string) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        if (slides.fetch) {
          slides.fetch();
        }
      }
    });
  }

  render() {
    return (
      <EditSlideFeedback
        schema={editSlideFeedbackSchema}
        slide={this.props.slide.data}
        onSlideUpdate={this.onSlideUpdate}
      />
    );
  }
};

export default WithCache(EditSlideFeedbackContainer, {}, ['slide']);