import React, { useRef } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

type Option = {
  text: string,
  action: string,
  icon?: string,
  color?: string
};

const Options = ({
  options,
  title,
  text,
  icon = 'options',
  isOpen,
  onToggle,
  onOptionClicked
}: {
  options: Option[],
  title?: string,
  text?: string,
  icon?: string,
  isOpen: boolean,
  onToggle: (isOpen: boolean) => void,
  onOptionClicked: (action: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => onToggle(false));
  return (
    <div className="relative" ref={ref}>
      <FlatButton icon={icon} text={text} title={title} onClick={() => onToggle(!isOpen)} />
      {(isOpen) && (
        <div className="absolute right-0 top-full w-40 z-10 bg-lm-0 dark:bg-dm-0 border border-lm-1 dark:border-dm-1 rounded shadow">
          {map(options, (option) => {
            return (
              <FlatButton
                key={`${option.icon}-${option.text}`}
                icon={option.icon}
                text={option.text}
                color={option.color}
                size="sm"
                className="px-2 py-3 w-full"
                onClick={() => onOptionClicked(option.action)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Options;