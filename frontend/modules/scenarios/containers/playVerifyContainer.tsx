import React, { Component } from 'react';
import addModal from '~/core/dialogs/helpers/addModal';
import VerifyCodeDialogContainer from '~/modules/authentication/containers/verifyCodeDialogContainer';

class PlayVerifyContainer extends Component {

  componentDidMount(): void {
    addModal({
      component: <VerifyCodeDialogContainer />
    }, () => {

    })
  }

  render() {
    return (
      <div></div>
    );
  }
};

export default PlayVerifyContainer;