import React, { Component } from 'react';
import Create from '../components/create';
import sortSlides from '../helpers/sortSlides';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import getCurrentStemSlides from '~/modules/stems/helpers/getCurrentStemSlides';
import getIsSortingLastSlideBeforeNavigation from '~/modules/stems/helpers/getIsSortingLastSlideBeforeNavigation';
import addModal from '~/core/dialogs/helpers/addModal';

class CreateContainer extends Component {

  componentDidMount = () => {

    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');

    if (!slideId && this.props.scenario.data?._id) {

      const currentStemSlides = getCurrentStemSlides();
      const firstSlide = currentStemSlides[0];

      setTimeout(() => {
        this.props.router.navigate(`/scenarios/${this.props.scenario.data._id}/create?slide=${firstSlide._id}`, {
          replace: true
        })
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
        const isSortingLastSlideBeforeNavigation = getIsSortingLastSlideBeforeNavigation({
          sourceIndex: active.data.current.sortOrder,
          destinationIndex: over.data.current.sortOrder
        });
        if (!isSortingLastSlideBeforeNavigation) {
          return sortSlides({ active, over });
        }
        addModal({
          title: 'Ordering slides',
          body: "The last slide is linked to branching stems, so slides can't be moved into or out of the last position. Delete the branching stems to reorder it.",
          actions: [{
            type: 'OK',
            text: 'Ok'
          }]
        });
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