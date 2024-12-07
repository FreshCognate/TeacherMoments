import React, { Component } from 'react';
import DialogToast from '../components/dialogToast';

class DialogToastContainer extends Component {

  componentDidMount = () => {
    const { toast } = this.props;
    if (toast.timeout) {
      this.timeout = setTimeout(() => {
        toast.triggerAction("TIMEOUT");
      }, toast.timeout);
    }
  };

  componentWillUnmount = () => {
    if (this.props.toast.timeout) {
      clearTimeout(this.timeout);
    }
  };

  render() {
    const { toast, onActionClicked } = this.props;
    return (
      <DialogToast
        id={toast._id}
        icon={toast.icon}
        title={toast.title}
        body={toast.body}
        component={toast.component}
        position={toast.position}
        actions={toast.actions}
        onActionClicked={onActionClicked}
      />
    );
  }
};

export default DialogToastContainer;