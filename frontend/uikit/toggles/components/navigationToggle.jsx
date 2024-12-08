import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const NavigationToggle = ({
  value,
  options,
  color = "primary",
  className,
  size,
  isDisabled,
  onClick
}) => {
  const classNames = classnames('inline-flex items-center', className);
  return (
    <div className={classNames}>
      {map(options, (option) => {
        const isSelected = value === option.value;

        let className = classnames('border-b', {
          'p-2': size !== 'sm',
          'py-1 mx-2 text-xs': size === 'sm',
          'border-b-primary-regular': isSelected,
          'border-b-transparent': !isSelected
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

export default NavigationToggle;