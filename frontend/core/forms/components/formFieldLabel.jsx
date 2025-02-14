import React from 'react';

const FormFieldLabel = ({
  fieldId = '',
  label = '',
  size,
  isInline,
}) => {
  if (!label) return null;
  return (
    <label htmlFor={fieldId} className={`mb-2 inline-block text-xs text-black/60 dark:text-white/60 font-bold`} style={{ width: isInline ? '120px' : 'auto' }}>
      {label}
    </label>
  );
};

export default React.memo(FormFieldLabel);
