import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';
import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';
import Button from '~/uikit/buttons/components/button';

const SlidePlayerNavigation = ({
  primaryAction,
  secondaryAction,
  onActionClicked,
}) => {
  return (
    <div className="pb-4 px-4">
      <div className="flex ">
        <div className="mr-2 w-full">
          {(secondaryAction) && (
            <Button text={secondaryAction.text} isDisabled={secondaryAction.isDisabled} color={secondaryAction.color} isFullWidth onClick={() => onActionClicked(secondaryAction.action)} />
          )}
        </div>
        <div className="ml-2 w-full">
          {(primaryAction) && (
            <Button text={primaryAction.text} isDisabled={primaryAction.isDisabled} color={primaryAction.color} isFullWidth onClick={() => onActionClicked(primaryAction.action)} />
          )}
        </div>
      </div>
      {/* {(activeSlide.children.length > 0) && (
        <div className="mt-4">
          {map(activeSlide.children, (childRef) => {
            const childSlide = find(getCache('slides').data, { ref: childRef });
            if (!childSlide) return null;
            return (
              <div key={childRef}>
                <FlatButton
                  text={childSlide.name}
                  className="border bg-lm-2 dark:bg-dm-2 border-lm-2 dark:border-dm-2 p-2 w-full mb-2 rounded-md"
                  onClick={() => navigateTo({ slideRef: childRef })}
                />
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
};

export default SlidePlayerNavigation;