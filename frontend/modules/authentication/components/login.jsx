import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Button from '~/uikit/buttons/components/button';

const Login = ({
  model,
  onLoginFormUpdate,
  onLoginButtonClicked
}) => {
  return (
    <div>
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
      <Button text="Login" onClick={onLoginButtonClicked} />
    </div>
  );
};

export default Login;