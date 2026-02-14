import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const SignupDialog = ({
  model,
  alertText,
  alertType,
  isSignupButtonDisabled,
  onSignupFormUpdate,
  onSignupButtonClicked,
}: {
  model: any,
  alertText: string,
  alertType: 'info' | 'warning',
  isSignupButtonDisabled: boolean,
  onSignupFormUpdate: ({ update }: { update: any }) => void,
  onSignupButtonClicked: () => void
}) => {
  return (
    <div className="px-4 pb-4">
      <FormContainer
        schema={{
          username: {
            type: 'Username',
            label: 'Username',
            help: 'Pick a unique username, this can also be your name without spaces.'
          },
          email: {
            type: 'Text',
            label: 'Email',
            help: 'Enter your email, this will be used for logging into the system.'
          }
        }}
        model={model}
        onUpdate={onSignupFormUpdate}
      />
      <div className="py-4">
        <Alert text={alertText} type={alertType} />
      </div>
      <Button text="Signup" isDisabled={isSignupButtonDisabled} onClick={onSignupButtonClicked} />
    </div>
  );
};

export default SignupDialog;