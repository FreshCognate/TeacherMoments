import React from 'react';
import DialogProgressContainer from '../containers/dialogProgressContainer';
import Form from '~/core/forms/containers/formContainer';

const DialogsModalContent = ({
  modalData,
  component,
  schema,
  renderKey,
  isFullScreen,
  isProgressType,
  onFormUpdate,
  onActionClicked,
  onCloseButtonClicked
}) => {

  let style = {};

  if (isFullScreen) {
    style = { height: '100vh' };
  }

  if (isProgressType) {
    style = { height: '400px' };
  }

  const renderForm = (schema, renderKey) => {
    return (
      <div className="p-4">
        <Form
          renderKey={renderKey}
          schema={schema}
          model={modalData}
          onUpdate={onFormUpdate}
          form={{ onActionClicked, onCloseButtonClicked }}
        />
      </div>
    );
  };

  return (
    <div style={style} className="overflow-y-auto">
      {isProgressType && (
        <div className="p-4">
          <DialogProgressContainer
            onCloseButtonClicked={onCloseButtonClicked}
          />
        </div>
      )}
      {(!isProgressType && component) && React.isValidElement(component) && (
        <>
          {React.cloneElement(component, {
            actions: {
              onActionClicked,
              onCloseButtonClicked,
            }
          })}
        </>
      )}
      {(!isProgressType && schema) && renderForm(schema, renderKey)}
    </div>
  );
};

export default DialogsModalContent;