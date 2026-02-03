import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';

type Props = {
  errors: string[];
  onClick: () => void;
  className?: string;
}

export default function ValidationIndicator({
  errors,
  onClick,
  className
}: Props) {
  if (!errors || errors.length === 0) return null;

  const count = errors.length;
  const text = count === 1 ? '1 issue' : `${count} issues`;

  const classes = classnames(
    'flex items-center gap-x-1.5 py-1 px-2 rounded-full text-xs',
    'bg-yellow-500/10 dark:bg-yellow-400/10',
    'text-yellow-600 dark:text-yellow-400',
    'border border-yellow-500/30 dark:border-yellow-400/30',
    'cursor-pointer hover:bg-yellow-500/20 dark:hover:bg-yellow-400/20',
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
