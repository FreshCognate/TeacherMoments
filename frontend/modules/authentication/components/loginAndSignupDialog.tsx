import React from 'react';
import Button from '~/uikit/buttons/components/button';

const LoginAndSignupDialog = ({
  onProcessClicked
}: {
  onProcessClicked: (process: string) => void
}) => {
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <div className="flex items-center">
        <div className="w-2/3 text-sm pr-4">
          If you do not have an account, but wish to create one.
        </div>
        <div className="w-1/3 flex justify-end items-center">
          <Button
            text="Create an account"
            isFullWidth
            onClick={() => onProcessClicked("CREATE")}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-2/3 text-sm pr-4">
          If you do not have an account, and do not wish to create one, but still want to participate in scenarios.
        </div>
        <div className="w-1/3 flex justify-end items-center">
          <Button
            text="Create anonymously"
            isFullWidth
            onClick={() => onProcessClicked("ANONYMOUSLY")}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-2/3 text-sm pr-4">
          If you already have an account.
        </div>
        <div className="w-1/3 flex justify-end items-center">
          <Button
            text="Login"
            isFullWidth
            onClick={() => onProcessClicked("LOGIN")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginAndSignupDialog;