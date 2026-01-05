import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const VerifyCodeDialog = ({
  model,
  hasError,
  error,
  isVerifying,
  onVerifyFormUpdate,
  onVerifyButtonClicked
}: {
  model: { code: string },
  hasError: boolean,
  error: string,
  isVerifying: boolean,
  onVerifyFormUpdate: ({ update }: { update: any }) => void,
  onVerifyButtonClicked: () => void
}) => {
  return (
    <div className="px-4 py-4">
      <FormContainer
        schema={{
          code: {
            type: 'Text',
            label: 'Verification Code',
            help: 'Enter the verification code sent to your email',
            shouldAutoFocus: true
          }
        }}
        model={model}
        onUpdate={onVerifyFormUpdate}
      />
      {hasError && (
        <div className="py-4">
          <Alert text={error} type="warning" />
        </div>
      )}
      <Button
        text={isVerifying ? 'Verifying...' : 'Verify Code'}
        isDisabled={isVerifying || !model.code || model.code.length !== 6}
        onClick={onVerifyButtonClicked}
      />
    </div>
  );
};

export default VerifyCodeDialog;