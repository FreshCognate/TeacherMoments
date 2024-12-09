import React, { Component } from 'react';
import SlidesPanel from '../components/slidesPanel';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';
import get from 'lodash/get';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';

class SlidesPanelContainer extends Component {

  componentDidMount = () => {
    const { slides } = this.props;
    if (slides.data.length > 0) {
      const firstSlideId = slides.data[0]._id;
      setTimeout(() => {
        this.onSlideClicked(firstSlideId);
      }, 0);
    }
  }

  getSelectedSlideId = () => {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    return searchParams.get('slide');
  }

  sortSlides = ({ sourceIndex, destinationIndex, slides }) => {
    const clonedSlides = cloneDeep(slides.data);
    const [removed] = clonedSlides.splice(sourceIndex, 1);
    clonedSlides.splice(destinationIndex, 0, removed);

    each(clonedSlides, (item, index) => {
      item.sortOrder = index;
    });

    slides.set(clonedSlides, { setType: 'replace' });

    axios.put(`/api/slides/${removed._id}`, { sourceIndex, destinationIndex }).then(() => {
      this.props.slides.fetch();
    })
  }

  onAddSlideClicked = () => {
    const { router, slides } = this.props;
    slides.setStatus('syncing');
    axios.post(`/api/slides`, { scenario: router.params.id }).then((response) => {
      slides.fetch().then(() => {
        const slideId = get(response, 'data.slide._id');
        if (slideId) {
          this.onSlideClicked(slideId);
        }
      });
    })
  }

  onSlideClicked = (slideId) => {
    const { router } = this.props;
    router.navigate(`/scenarios/${router.params.id}/create?slide=${slideId}`, { replace: true })
  }

  onDeleteSlideClicked = (slideId) => {
    const { router, slides } = this.props;
    slides.setStatus('syncing');
    router.navigate(`/scenarios/${router.params.id}/create`, { replace: true })
    axios.delete(`/api/slides/${slideId}`).then(() => {
      slides.fetch();
    })
  }

  onSortUpClicked = (sortOrder) => {
    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder - 1;

    this.sortSlides({ sourceIndex, destinationIndex, slides: this.props.slides });
  }

  onSortDownClicked = (sortOrder) => {

    const sourceIndex = sortOrder;
    const destinationIndex = sortOrder + 1;

    this.sortSlides({ sourceIndex, destinationIndex, slides: this.props.slides });

  }

  render() {
    return (
      <SlidesPanel
        slides={this.props.slides.data}
        selectedSlideId={this.getSelectedSlideId()}
        onAddSlideClicked={this.onAddSlideClicked}
        onSlideClicked={this.onSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
        onSortUpClicked={this.onSortUpClicked}
        onSortDownClicked={this.onSortDownClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlidesPanelContainer, null, ['slides']));