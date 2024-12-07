import React from 'react';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';
import Body from '~/uikit/content/components/body';
import Button from '~/uikit/buttons/components/button';
import Badge from '~/uikit/badges/components/badge';
import classnames from 'classnames';
import { Link } from 'react-router';

const DialogProgress = ({
  items,
  onCloseButtonClicked
}) => {
  return (
    <div>
      {map(items, (item) => {
        const isAnimating = !item.isComplete;

        const containerClassName = classnames('relative transition-all', {
          'text-primary-regular dark:text-primary-light': item.isComplete
        });

        const iconClassName = classnames({
          'animate-pulse': isAnimating
        });

        const loadingIconClassName = classnames('absolute top-0', {
          'animate-ping': isAnimating
        });

        return (
          <div
            key={item._id}
            className="flex items-start mb-6"
          >
            <div className="flex flex-col items-center">
              {(item.hasError) && (
                <div className="text-warning-regular dark:text-warning-light">
                  <Icon icon="warning" />
                </div>
              )}
              {(!item.hasError) && (
                <div className={containerClassName}>
                  <div className={iconClassName}>
                    <Icon icon={item.isComplete ? 'complete' : 'incomplete'} />
                  </div>
                  {(!item.isComplete) && (
                    <div className={loadingIconClassName}>
                      <Icon icon="dot" />
                    </div>
                  )}
                </div>
              )}
              {(item.progress) && (
                <div className="relative w-100">
                  <div className="absolute w-100 text-center">
                    <Body size='xs' body={item.progress} />
                  </div>
                </div>
              )}
            </div>
            <div className="ml-4">
              {(item.link) && (
                <Link to={item.link} target='_blank' className="block border-b border-b-lm-3 dark:border-b-dm-3 hover:opacity-80" onClick={onCloseButtonClicked}>
                  <Body body={item.text} />
                </Link>
              )}
              {(!item.link) && (
                <Body body={item.text} />
              )}
              {(item.hasError || item.hasCloseButton) && (
                <div className="mt-4">
                  <Button text="Close" onClick={onCloseButtonClicked} />
                </div>
              )}
            </div>
            {item.status && (
              <div className="ml-4">
                <Badge text={item.status} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DialogProgress;