import React from 'react';

const FormFieldHelp = ({ help = '', size }) => {
  if (!help) return null;

  return (
    <p className={`mb-3 text-xs text-black dark:text-white text-opacity-60 dark:text-opacity-60`} dangerouslySetInnerHTML={{ __html: help }} />
  );
};

export default React.memo(FormFieldHelp);
