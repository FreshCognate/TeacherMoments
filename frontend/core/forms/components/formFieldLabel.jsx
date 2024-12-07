import React from 'react';

const FormFieldLabel = ({
  fieldId = '',
  label = '',
  size,
  isInline,
}) => {
  if (!label) return null;
  return (
    <label htmlFor={fieldId} className={`mb-1 inline-block text-${size} font-bold`} style={{ width: isInline ? '120px' : 'auto' }}>
      {label}
    </label>
  );
};

export default React.memo(FormFieldLabel);
