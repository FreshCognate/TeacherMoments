import React, { Component } from 'react';
import EditSlide from '../components/editSlide';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editSlideSchema from '../schemas/editSlideSchema';

class EditSlideContainer extends Component {

  onSlideFormUpdate = ({ update }) => {
    const slides = getCache('slides');
    slides.setStatus('syncing');
    this.props.slide.mutate(update, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        slides.fetch();
      }
    });
  }

  render() {
    return (
      <EditSlide
        schema={editSlideSchema}
        slide={this.props.slide.data}
        onSlideFormUpdate={this.onSlideFormUpdate}
      />
    );
  }
};

export default WithCache(EditSlideContainer, {
  slide: {
    url: '/api/slides/:id',
    getInitialData: () => ({}),
    transform: ({ data }) => data.slide,
    getParams: ({ props }) => {
      return {
        id: props.slideId
      }
    }
  }
});