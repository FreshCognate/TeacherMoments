import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

const contentClasses = 'z-10 bg-lm-0 dark:bg-dm-0 border border-lm-2 dark:border-dm-2 rounded-md shadow-lg px-2 py-1 text-xs text-black/80 dark:text-white/80 max-w-xs data-[state=delayed-open]:animate-overlay-fade-in data-[state=instant-open]:animate-overlay-fade-in origin-[var(--radix-tooltip-content-transform-origin)]';

const Tooltip = ({
  content,
  children,
  placement = 'top',
  align = 'center',
  delay = 200
}) => {
  if (!content) return children || null;

  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={placement}
            align={align}
            sideOffset={6}
            className={contentClasses}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default React.memo(Tooltip);
