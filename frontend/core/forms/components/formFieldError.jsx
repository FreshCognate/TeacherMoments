import React from 'react';

const FormFieldError = ({
  hasError = false,
  error = '',
}) => {
  if (!hasError) return null;

  return (
    <div className="text-sm">{error}</div>
  );
};

export default React.memo(FormFieldError);
