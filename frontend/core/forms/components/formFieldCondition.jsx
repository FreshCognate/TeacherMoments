import React from 'react';

const FormFieldCondition = ({ condition, hasCondition = false }) => {
  if (!hasCondition) return null;

  return (
    <div className="text-sm" dangerouslySetInnerHTML={{ __html: condition.error }} />
  );
};

export default React.memo(FormFieldCondition);
