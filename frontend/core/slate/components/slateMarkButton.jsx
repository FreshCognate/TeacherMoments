import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import toggleMark, { isMarkActive } from '../helpers/toggleMark';
import classnames from 'classnames';

const SlateMarkButton = ({
  editor,
  format,
  icon,
  text
}) => {

  const isButtonActive = isMarkActive(editor, format);

  const className = classnames('p-1 mr-1 rounded-md opacity-70 hover:opacity-100', {
    'text-primary-regular dark:text-primary-light': isButtonActive,
    '': isButtonActive
  });

  return (
    <button
      className={className}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
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

export default SlateMarkButton;