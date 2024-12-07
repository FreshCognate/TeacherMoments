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

  const className = classnames('p-1 mr-1 rounded-md border border-lm-2 bg-lm-2',
    'dark:border-dm-2 dark:bg-dm-2 dark:fill-white',
    'hover:bg-lm-3 hover:border-lm-3 hover:dark:bg-dm-3 hover:dark:border-dm-3', {
    'border-primary-regular fill-primary-regular dark:border-primary-dark dark:fill-primary-light': isButtonActive,
    'hover:border-primary-dark hover:fill-primary-regular hover:dark:border-primary-light hover:dark:fill-primary-light': isButtonActive
  });

  return (
    <button
      className={className}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      style={{ width: '26px', height: '26px' }}
    >
      {(icon) && (
        <Icon icon={icon} size={16} />
      )}
      {(text) && (
        text
      )}
    </button>
  );
};

export default SlateBlockButton;