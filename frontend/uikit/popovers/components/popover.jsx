import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import Icon from '~/uikit/icons/components/icon';

const contentClasses = 'z-10 bg-lm-0 dark:bg-dm-0 border border-lm-2 dark:border-dm-2 rounded-md shadow-lg p-3 text-xs text-black/80 dark:text-white/80 min-w-64 max-w-80 data-[state=open]:animate-overlay-fade-in origin-[var(--radix-popover-content-transform-origin)]';

const iconButtonClasses = 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-regular focus:ring-offset-1 rounded-full inline-flex items-center';

const Popover = ({
  content,
  children,
  icon = 'info',
  iconSize = 14,
  placement = 'right',
  align = 'center'
}) => {
  if (!content) return null;

  const trigger = children || (
    <button
      type="button"
      className={iconButtonClasses}
      aria-label="More information"
    >
      <Icon icon={icon} size={iconSize} />
    </button>
  );

  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        {trigger}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={placement}
          align={align}
          sideOffset={8}
          className={contentClasses}
        >
          {content}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default React.memo(Popover);
