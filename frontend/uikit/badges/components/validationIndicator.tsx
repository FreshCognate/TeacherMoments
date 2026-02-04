import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';

type Props = {
  errors: string[];
  onClick: () => void;
  className?: string;
  variant?: 'pill' | 'inline';
}

export default function ValidationIndicator({
  errors,
  onClick,
  className,
  variant = 'pill'
}: Props) {
  if (!errors || errors.length === 0) return null;

  const count = errors.length;
  const text = count === 1 ? '1 issue' : `${count} issues`;

  const classes = classnames(
    'flex items-center gap-x-1.5 text-xs cursor-pointer',
    'text-yellow-500 dark:text-yellow-200',
    {
      'py-1 px-2 rounded-md': variant === 'pill',
      'bg-yellow-500/10 dark:bg-yellow-400/10': variant === 'pill',
      'border border-yellow-500/30 dark:border-yellow-400/10': variant === 'pill',
      'hover:bg-yellow-500/20 dark:hover:bg-yellow-400/20': variant === 'pill',
      'hover:text-yellow-700 dark:hover:text-yellow-300': variant === 'inline',
    },
    className
  );

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label={`${count} validation ${count === 1 ? 'issue' : 'issues'}. Click to view.`}
    >
      <Icon icon="warning" size={12} />
      <span className="font-medium">{text}</span>
    </button>
  );
}
