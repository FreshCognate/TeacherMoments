import React, { useState } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import { motion } from 'framer-motion';
import Title from '~/uikit/content/components/title';
import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';
import ScenarioSyncStatusContainer from '~/modules/scenarios/containers/scenarioSyncStatusContainer';
import TriggersValidationContainer from '~/modules/triggers/containers/triggersValidationContainer';

const DialogSidePanel = ({
  sidePanel,
}) => {

  const animationDepth = 200;

  const animation = {
    animate: { x: 0, opacity: 1 },
    transition: { ease: [0.8, 0, 0.3, 1], duration: 0.6, delay: 0.3 },
  };

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const style = {};

  if (sidePanel.position === 'right') {
    style.right = 0;
    animation.initial = { x: animationDepth, opacity: 0 };
  } else {
    style.left = 0;
    animation.initial = { x: -animationDepth, opacity: 0 };
  }

  if (isAnimatingOut) {
    if (sidePanel.position === 'right') {
      animation.animate = { x: animationDepth, opacity: 0 };
    } else {
      animation.animate = { x: -animationDepth, opacity: 0 };
    }
    animation.transition = { ease: [0.8, 0, 0.3, 1], duration: 0.6, delay: 0 };
  }

  const elementClassName = classnames("relative w-full h-full p-4 flex", {
    "justify-end": sidePanel.position === 'right',
    "justify-start": sidePanel.position === 'left'
  });

  const className = classnames("flex flex-col relative w-full bg-lm-0 rounded-lg border border-lm-1 dark:border-dm-1 dark:bg-dm-0", {
    "max-w-md": sidePanel.size !== 'md' && sidePanel.size !== 'lg',
    "max-w-xl": sidePanel.size === 'md',
    "max-w-5xl": sidePanel.size === 'lg'
  });

  return (
    <div
      className={elementClassName}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setIsAnimatingOut(true);
          setTimeout(() => {
            sidePanel.triggerClose();
          }, 600);
        }
      }}
    >
      <motion.div
        className={className}
        animate={animation.animate}
        initial={animation.initial}
        transition={animation.transition}
        style={style}
      >

        <div className="flex flex-0 items-center justify-between pl-4 pr-2 py-2 border-b border-b-lm-3 dark:border-b-dm-2 max-h-full">

          <div className="flex items-center">
            {(sidePanel.icon) && (
              <Icon icon={sidePanel.icon} className="mr-2" />
            )}
            <Title title={sidePanel.title} element="h5" className="text-lg font-normal" />
          </div>
          <div className="flex items-center gap-x-2">
            {(sidePanel.icon === 'trigger') && (
              <TriggersValidationContainer />
            )}
            <ScenarioSyncStatusContainer />
            <FlatButton icon="cancel" isCircular onClick={() => {
              setIsAnimatingOut(true);
              setTimeout(() => {
                sidePanel.triggerClose();
              }, 600);
            }} />
          </div>

        </div>
        <div className="flex-grow flex-1 overflow-y-scroll">
          {sidePanel.component && React.isValidElement(sidePanel.component) && (
            <>
              {React.cloneElement(sidePanel.component, {
                actions: {
                  triggerClose: () => {
                    setIsAnimatingOut(true);
                    setTimeout(() => {
                      sidePanel.triggerClose();
                    }, 600);
                  }
                }
              })}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DialogSidePanel;