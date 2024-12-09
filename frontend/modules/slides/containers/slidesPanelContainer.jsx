import React, { Component } from 'react';
import SlidesPanel from '../components/slidesPanel';
import WithCache from '~/core/cache/containers/withCache';
import WithRouter from '~/core/app/components/withRouter';
import axios from 'axios';

class SlidesPanelContainer extends Component {

  onAddSlideClicked = () => {
    axios.post(`/api/slides`, { scenario: this.props.router.params.id }).then(() => {
      this.props.slides.fetch();
    })
  }

  onSlideClicked = (slideId) => {
    this.props.router.navigate(`/scenarios/${this.props.router.params.id}/create?slide=${slideId}`, { replace: true })
  }

  onDeleteSlideClicked = (slideId) => {
    axios.delete(`/api/slides/${slideId}`).then(() => {
      this.props.slides.fetch();
    })
  }

  render() {
    return (
      <SlidesPanel
        slides={this.props.slides.data}
        onAddSlideClicked={this.onAddSlideClicked}
        onSlideClicked={this.onSlideClicked}
        onDeleteSlideClicked={this.onDeleteSlideClicked}
      />
    );
  }
};

export default WithRouter(WithCache(SlidesPanelContainer, null, ['slides']));