import React, { Component } from 'react';
import Create from '../components/create';
import sortSlides from '../helpers/sortSlides';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';

class CreateContainer extends Component {

  componentDidMount = () => {

    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');

    if (!slideId && this.props.scenario.data?._id) {

      const firstSlide = this.props.slides.data[0];

      setTimeout(() => {
        this.props.router.navigate(`/scenarios/${this.props.scenario.data._id}/create?slide=${firstSlide._id}`)
      }, 0);

    }

  }

  onDragOver = () => {
    return;
  }

  onDragStart = () => {
    return;
  }

  onDragEnd = async (event) => {
    const { active, over } = event;
    const { type: activeType } = active.data.current;

    if (activeType === 'SLIDES') {
      const { type: overType } = over?.data?.current || {};
      if (overType === 'SLIDES') {
        sortSlides({ active, over });
      }
      return;
    }
  };

  render() {
    return (
      <Create
        onDragOver={this.onDragOver}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      />
    );
  }
};

export default WithRouter(WithCache(CreateContainer, null, ['scenario', 'slides']));