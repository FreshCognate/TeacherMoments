import React from 'react';
import Icon from '~/uikit/icons/components/icon';

const PasswordStrength = ({
  passwordStrength,
  passwordAttributes
}: {
  passwordStrength: number,
  passwordAttributes: {
    hasMinLength: boolean,
    hasNumber: boolean,
    hasLowercase: boolean,
    hasUppercase: boolean,
    hasSymbol: boolean
  }
}) => {
  return (
    <div>
      <div className="flex justify-between mb-2 text-xs text-black/60 dark:text-white/60 font-bold">
        <div>
          Password strength
        </div>
        <div>
          {`${passwordStrength}/5`}
        </div>
      </div>
      <div className="mb-2">
        <div className="rounded-sm bg-lm-2 dark:bg-dm-2 h-1">
          <div className="rounded-sm bg-primary-regular dark:bg-primary-light h-1" style={{ width: `${100 / 5 * passwordStrength}%` }} />
        </div>
      </div>
      <div className="flex items-center text-sm text-black/60 dark:text-white/60 mb-1">
        <Icon icon={passwordAttributes.hasMinLength ? 'checked' : 'unchecked'} size={16} />
        <span className="ml-2">
          At least 8 characters
        </span>
      </div>
      <div className="flex items-center text-sm text-black/60 dark:text-white/60 mb-1">
        <Icon icon={passwordAttributes.hasNumber ? 'checked' : 'unchecked'} size={16} />
        <span className="ml-2">
          At least 1 number
        </span>
      </div>
      <div className="flex items-center text-sm text-black/60 dark:text-white/60 mb-1">
        <Icon icon={passwordAttributes.hasLowercase ? 'checked' : 'unchecked'} size={16} />
        <span className="ml-2">
          At least 1 lowercase letter
        </span>
      </div>
      <div className="flex items-center text-sm text-black/60 dark:text-white/60 mb-1">
        <Icon icon={passwordAttributes.hasUppercase ? 'checked' : 'unchecked'} size={16} />
        <span className="ml-2">
          At least 1 uppercase letter
        </span>
      </div>
      <div className="flex items-center text-sm text-black/60 dark:text-white/60 mb-1">
        <Icon icon={passwordAttributes.hasSymbol ? 'checked' : 'unchecked'} size={16} />
        <span className="ml-2">
          At least 1 special character
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;