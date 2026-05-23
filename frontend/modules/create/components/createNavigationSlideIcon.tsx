import React from 'react';
import { Link } from 'react-router';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';
import { Stem } from '~/modules/stems/stems.types';
import map from 'lodash/map';
import getCache from '~/core/cache/helpers/getCache';
import Tooltip from '~/uikit/tooltips/components/tooltip';

const CreateNavigationSlideIcon = ({
  icon,
  link,
  tooltipContent,
  activeSlideStems = [],
  activeStemId,
  scenarioId,
  isSelected = false
}: {
  icon: string,
  link: string,
  tooltipContent: string,
  activeSlideStems: Stem[],
  activeStemId: string,
  scenarioId: string,
  isSelected: boolean
}) => {
  return (
    <div className={classnames("rounded-md", {
      "border-2 border-blue-400": isSelected
    })}>
      <Tooltip content={tooltipContent} placement='right'>
        <Link to={link} replace
          className={classnames("hover:bg-lm-2 dark:hover:bg-dm-2 w-8 h-8 flex items-center justify-center rounded-md transition-colors", {
            "hover:bg-lm-2 dark:hover:bg-dm-2": !isSelected
          })}
        >
          <Icon icon={icon} size={16} />
        </Link>
      </Tooltip>
      {isSelected && (
        <div className="p-1 flex flex-col gap-y-1">
          {map(activeSlideStems, (activeSlideStem) => {
            const firstStemSlide = getCache('slides').get('firstStemSlide', { stemRef: activeSlideStem.ref });
            return (
              <Tooltip content="Stem" placement='right' key={activeSlideStem._id}>

                <Link key={activeSlideStem._id} to={`/scenarios/${scenarioId}/create?slide=${firstStemSlide._id}`} replace
                  className={classnames("border w-6 h-6 flex items-center justify-center rounded-md transition-colors", {
                    "border-lm-2 dark:border-dm-2 hover:bg-lm-2 dark:hover:bg-dm-2": activeStemId !== activeSlideStem._id,
                    "border-blue-500 dark:border-blue-400": activeStemId === activeSlideStem._id
                  })}
                >
                  <Icon icon="branching" size={16} />
                </Link>
              </Tooltip>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CreateNavigationSlideIcon;