import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const Username = ({
  value,
  schema,
  isGenerating,
  error,
  updateField,
  onGenerateUsername,
}: {
  value: string,
  schema: any,
  isGenerating: boolean,
  error: string,
  updateField: (value: string) => void,
  onGenerateUsername: () => void,
}) => {
  return (
    <div>
      <input
        type="text"
        value={value}
        disabled={schema.isDisabled}
        className="py-3 px-3 text-sm text-black/80 dark:text-white/80 bg-lm-4/50 dark:bg-dm-4/50 rounded w-full focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-2"
        onChange={(event) => updateField(event.target.value)}
      />
      {error ? (
        <p className="mt-1 text-xs text-warning-regular dark:text-warning-light">{error}</p>
      ) : (
        <div className="mt-2">
          <FlatButton
            icon="syncing"
            text="Generate random username"
            size="sm"
            isDisabled={isGenerating}
            onClick={onGenerateUsername}
          />
        </div>
      )}
    </div>
  );
};

export default Username;
