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
            help: 'Facilitators see this name next to your answers. Keep the one we made up, or use your own: at least 6 letters, no spaces.'
          },
          email: {
            type: 'Text',
            label: 'Email',
            help: "You'll log in with this email. We send a code to it each time."
          }
        }}
        model={model}
        onUpdate={onSignupFormUpdate}
      />
      <div className="py-4">
        <Alert text={alertText} type={alertType} />
      </div>
      <Button text="Create account" isDisabled={isSignupButtonDisabled} onClick={onSignupButtonClicked} />
    </div>
  );
};

export default SignupDialog;