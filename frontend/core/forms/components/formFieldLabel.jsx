import React from 'react';
import Tooltip from '~/uikit/tooltips/components/tooltip';

const FormFieldLabel = ({
  fieldId = '',
  label = '',
  size,
  isInline,
  tooltip = '',
}) => {
  if (!label) return null;
  return (
    <label htmlFor={fieldId} className={`mb-2 inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60 font-bold`} style={{ width: isInline ? '120px' : 'auto' }}>
      <span>{label}</span>
      {tooltip && <Tooltip content={tooltip} iconSize={16} />}
    </label>
  );
};

export default React.memo(FormFieldLabel);
