import map from 'lodash/map';
import classnames from 'classnames';

const SelectOptions = ({
  className,
  options,
  value,
  size,
  isDisabled,
  onChange
}: {
  className?: string,
  options: { value: string, text: string }[],
  value: string | number,
  size?: 'sm',
  isDisabled?: boolean,
  onChange: (value: string) => void
}) => {

  const classes = classnames('p-2 rounded bg-lm-0/60 dark:bg-dm-0/30', {
    'text-sm': size === 'sm'
  }, className);

  return (
    <select className={classes} value={value} disabled={isDisabled} onChange={(event) => onChange(event.target.value)}>
      {map(options, (option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        );
      })}
    </select>
  );
};

export default SelectOptions;
