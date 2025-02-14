import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const Toggle = ({
  value,
  options,
  color = "primary",
  className,
  size,
  isDisabled,
  onClick
}) => {
  const classNames = classnames('inline-flex items-center rounded overflow-hidden', className);
  return (
    <div className={classNames}>
      {map(options, (option) => {
        const isSelected = value === option.value;

        let className = classnames("bg-lm-0 dark:bg-dm-0", {
          'p-2': size !== 'sm',
          'py-1 px-2 text-xs': size === 'sm',
          'opacity-40': !isSelected,
          'opacity-100 dark:bg-white dark:bg-opacity-10': isSelected,
        });

        let selectedColor = isSelected ? color : null;
        return (
          <FlatButton color={selectedColor} size={size} isDisabled={isDisabled} className={className} key={option.value} {...option} onClick={(event) => {
            event.stopPropagation();
            onClick(option.value);
          }} />
        );
      })}
    </div>
  );
};

export default Toggle;