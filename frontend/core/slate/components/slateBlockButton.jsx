import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import toggleBlock, { isBlockActive } from '../helpers/toggleBlock';
import classnames from 'classnames';

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const SlateBlockButton = ({
  editor,
  format,
  text,
  icon
}) => {
  const isButtonActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');

  const className = classnames('p-1 mr-1 rounded-md opacity-70 hover:opacity-100', {
    'text-primary-regular dark:text-primary-light': isButtonActive,
    '': isButtonActive
  });

  return (
    <button
      className={className}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      style={{ width: '30px', height: '30px' }}
    >
      {(icon) && (
        <Icon icon={icon} size={20} />
      )}
      {(text) && (
        text
      )}
    </button>
  );
};

export default SlateBlockButton;