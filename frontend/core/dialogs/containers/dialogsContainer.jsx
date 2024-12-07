import find from 'lodash/find';
import React, { Component } from 'react';
import WithCache from '~/core/cache/containers/withCache';
import Dialogs from '../components/dialogs';

class DialogsContainer extends Component {

  state = { renderKey: 0 };

  onActionClicked = (type) => {
    this.props.dialogs.data.modal.triggerAction(type);
  };

  onFormUpdate = ({ update }) => {
    this.props.modal.set(update);
    this.setState({ renderKey: this.state.renderKey + 1 });
  };

  onCloseButtonClicked = (action) => {
    this.props.dialogs.data.modal.triggerAction(action || 'CLOSE');
  };

  onToastActionClicked = (id, type) => {
    const currentToast = find(this.props.dialogs.data.toasts, { _id: id });

    if (currentToast) {
      currentToast.triggerAction(type);
    }
  };

  render() {
    return (
      <Dialogs
        dialogs={this.props.dialogs.data}
        modalData={this.props.modal.data}
        renderKey={this.state.renderKey}
        onActionClicked={this.onActionClicked}
        onFormUpdate={this.onFormUpdate}
        onCloseButtonClicked={this.onCloseButtonClicked}
        onToastActionClicked={this.onToastActionClicked}
      />
    );
  }
};

export default WithCache(DialogsContainer, {
  dialogs: {
    getInitialData: () => {
      return {
        modal: null,
        toasts: [],
        sidePanel: null
      };
    }
  },
  modal: {
    getInitialData: () => {
      return {};
    }
  },
  dialogProgressItems: {
    getInitialData: () => {
      return [];
    }
  }
});