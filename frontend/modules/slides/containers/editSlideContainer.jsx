import React, { Component } from 'react';
import EditSlide from '../components/editSlide';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';
import editSlideSchema from '../schemas/editSlideSchema';
import find from 'lodash/find';

class EditSlideContainer extends Component {

  onSlideFormUpdate = ({ update }) => {
    const slides = getCache('slides');
    slides.setStatus('syncing');
    slides.set(update, { setType: 'itemExtend', setFind: { _id: this.props.slide.data._id } })
    this.props.slide.mutate(update, { method: 'put' }, (status) => {
      if (status === 'MUTATED') {
        const slides = getCache('slides');
        slides.fetch();
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
    getInitialData: ({ props }) => {
      const slides = getCache('slides');
      const currentSlide = find(slides.data, { _id: props.slideId });
      return currentSlide;
    },
    transform: ({ data }) => data.slide,
    getParams: ({ props }) => {
      return {
        id: props.slideId
      }
    }
  }
});