import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const Toggle = ({
  value,
  options,
  className,
  size,
  isDisabled,
  onClick
}) => {
  const classNames = classnames('inline-flex items-center rounded-md overflow-hidden p-0.5 bg-lm-2 dark:bg-dm-2', className);
  return (
    <div className={classNames}>
      {map(options, (option) => {
        const isSelected = value === option.value;

        let className = classnames("rounded-md border-2", {
          'p-2': size !== 'sm',
          'py-1 px-2 text-xs': size === 'sm',
          'opacity-100 border-transparent': !isSelected,
          'opacity-100 bg-lm-0 dark:bg-dm-2 border-lm-3 dark:border-dm-3 text-black/100 dark:text-white/100': isSelected,
        });

        return (
          <FlatButton size={size} isDisabled={isDisabled} className={className} key={option.value} {...option} onClick={(event) => {
            event.stopPropagation();
            onClick(option.value);
          }} />
        );
      })}
    </div>
  );
};

export default Toggle;