import React, { Component } from 'react';
import CreateSettings from '../components/createSettings';
import WithRouter from '~/core/app/components/withRouter';
import WithCache from '~/core/cache/containers/withCache';
import getCache from '~/core/cache/helpers/getCache';

class CreateSettingsContainer extends Component {

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
    return (
      <CreateSettings
        slide={this.props.slide.data}
        onSlideFormUpdate={this.onSlideFormUpdate}
      />
    );
  }
};

export default WithRouter(WithCache(CreateSettingsContainer, {
  slide: {
    url: '/api/slides/:id',
    getInitialData: ({ props }) => {
      const slides = getCache('slides');
      const searchParams = new URLSearchParams(props.router.location.search);
      const slideId = searchParams.get('slide');
      const currentSlide = find(slides.data, { _id: slideId });
      return currentSlide;
    },
    transform: ({ data }) => data.slide,
    getParams: ({ props }) => {
      const searchParams = new URLSearchParams(props.router.location.search);
      const slideId = searchParams.get('slide');
      return {
        id: slideId
      }
    }
  }
}));