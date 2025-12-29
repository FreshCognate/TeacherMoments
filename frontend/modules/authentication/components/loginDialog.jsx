import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const LoginDialog = ({
  model,
  hasError,
  error,
  onLoginFormUpdate,
  onLoginButtonClicked
}) => {
  return (
    <div className="px-4 pb-4">
      <FormContainer
        schema={{
          email: {
            type: 'Text',
            label: 'Email'
          },
          password: {
            type: 'Text',
            label: 'Password',
            textType: 'password'
          }
        }}
        model={model}
        onUpdate={onLoginFormUpdate}
      />
      {(hasError) && (
        <div className="py-4">
          <Alert text={error} type="warning" />
        </div>
      )}
      <Button text="Login" onClick={onLoginButtonClicked} />
    </div>
  );
};

export default LoginDialog;