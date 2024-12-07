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
  const classNames = classnames('border border-lm-0 inline-flex items-center rounded-sm dark:border-dm-3', className);
  return (
    <div className={classNames}>
      {map(options, (option) => {
        const isSelected = value === option.value;

        let className = classnames('p-2', {
          'opacity-40': !isSelected,
          'opacity-100 bg-white bg-opacity-10': isSelected,
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