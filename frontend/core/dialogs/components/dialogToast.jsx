import React from 'react';
import map from 'lodash/map';
import { motion } from 'framer-motion';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

const animation = {
  animate: { y: 0, opacity: 1 },
  initial: { y: 10, opacity: 0 },
  transition: { ease: [0.8, 0, 0.3, 1], duration: 0.3 },
};

const iconAnimation = {
  animate: { y: 0, opacity: 1 },
  initial: { y: 10, opacity: 0 },
  transition: { ease: [0.8, 0, 0.3, 1], duration: 0.3, delay: 0.3 },
};

const DialogToast = ({
  id,
  icon,
  title,
  body,
  component,
  actions,
  position,
  onActionClicked
}) => {
  const elementClassName = classnames('mt-4', {
    'fixed left-1/2 bottom-4 -translate-x-1/2': position === 'center',
  });
  return (
    <div
      className={elementClassName}
    >
      <motion.div
        animate={animation.animate}
        initial={animation.initial}
        transition={animation.transition}
      >
        <div className="flex rounded-lg bg-lm-0 border border-lm-1 dark:bg-dm-0 dark:border-dm-0 shadow-md">
          <div className="flex justify-start items-center">
            {(icon) && (
              <motion.div
                className="py-4 pl-4"
                animate={iconAnimation.animate}
                initial={iconAnimation.initial}
                transition={iconAnimation.transition}
              >
                <Icon icon={icon} />

              </motion.div>
            )}
            <div className="p-4" style={{ width: '240px' }}>
              {(title) && (
                <Title title={title} element="h6" className="text-lg font-light" />
              )}
              {(body) && (
                <Body body={body} />
              )}
              {component && React.isValidElement(component) && (
                <div>
                  {React.cloneElement(component, {
                    actions: {
                      onActionClicked: (type) => onActionClicked(id, type)
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          {(actions && actions.length > 0) && (
            <div className="flex items-center border-l pl-2 border-lm-1 dark:border-dm-1">
              {map(actions, (action) => {
                return (
                  <div key={action.type} className="mr-2">
                    <FlatButton
                      text={action.text}
                      onClick={() => onActionClicked(id, action.type)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DialogToast;