import React, { Component } from 'react';
import CreateSettings from '../components/createSettings';
import WithRouter from '~/core/app/components/withRouter';

class CreateSettingsContainer extends Component {
  render() {
    const searchParams = new URLSearchParams(this.props.router.location.search);
    const slideId = searchParams.get('slide');
    return (
      <CreateSettings
        slideId={slideId}
      />
    );
  }
};

export default WithRouter(CreateSettingsContainer);