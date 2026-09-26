import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import map from 'lodash/map';
import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';
import Button from '~/uikit/buttons/components/button';

const SlidePlayerNavigation = ({
  activeSlide,
  activeSlideStems,
  primaryAction,
  secondaryAction,
  navigateTo,
  hasPrompts,
  onActionClicked,
}) => {
  return (
    <div className="pb-4 px-4">
      {(activeSlideStems.length === 0 && !hasPrompts || hasPrompts) && (
        <div className="flex">
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
      )}
      {(activeSlideStems.length > 0 && !hasPrompts) && (
        <div className="mt-4">
          {map(activeSlideStems, (stem) => {
            const firstStemSlide = getCache('slides').get('firstStemSlide', { stemRef: stem.ref });
            if (firstStemSlide) {
              return (
                <div key={stem._id}>
                  <FlatButton
                    text={stem.name}
                    className="border bg-lm-2 dark:bg-dm-2 border-lm-2 dark:border-dm-2 p-2 w-full mb-2 rounded-md"
                    onClick={() => navigateTo({ slideRef: firstStemSlide.ref })}
                  />
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default SlidePlayerNavigation;