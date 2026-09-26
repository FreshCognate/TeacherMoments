import React, { Component } from 'react';
import EditSlide from '../components/editSlide';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editSlideSchema from '../schemas/editSlideSchema';
import { Slide } from '../slides.types';

interface EditSlideContainerProps {
  slide: {
    data: Slide,
    mutate: (
      update: Partial<Slide>,
      options: { method: string },
      callback: (status: string) => void
    ) => void
  }
}

class EditSlideContainer extends Component<EditSlideContainerProps> {

  onSlideFormUpdate = ({ update }: { update: Partial<Slide> }) => {
    const slides = getCache('slides');
    slides.setStatus('syncing');
    this.props.slide.mutate(update, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        if (slides.fetch) {
          slides.fetch();
        }
        const scenario = getCache('scenario');
        if (scenario.fetch) {
          scenario.fetch();
        }
      }
    });
  }

  render() {
    const { slide } = this.props;
    return (
      <EditSlide
        schema={editSlideSchema}
        slide={slide.data}
        onSlideFormUpdate={this.onSlideFormUpdate}
      />
    );
  }
};

export default WithCache(EditSlideContainer, {
  slide: {
    url: '/api/slides/:id',
    getInitialData: ({ props }: { props: any }) => {
      const slides = getCache('slides');
      const currentSlide = slides.get('active');
      return currentSlide;
    },
    transform: ({ data }: { data: { slide: Slide } }) => data.slide,
    getParams: ({ props }: { props: any }) => {
      const slides = getCache('slides');
      const currentSlide = slides.get('active');
      return {
        id: currentSlide?._id
      }
    }
  }
});