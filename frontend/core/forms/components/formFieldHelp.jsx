import React from 'react';

const FormFieldHelp = ({ help = '', size }) => {
  if (!help) return null;

  return (
    <p className={`mb-1 text-${size === 'sm' ? 'xs' : 'sm'}`} dangerouslySetInnerHTML={{ __html: help }} />
  );
};

export default React.memo(FormFieldHelp);
