import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';
import Options from '~/uikit/dropdowns/components/options';
import { ActiveSlide } from '../slides.types';

const SlidePlayerHeader = ({
  activeSlide,
  isMenuOpen,
  onMenuClicked,
  onMenuActionClicked
}: {
  activeSlide: ActiveSlide,
  isMenuOpen: boolean,
  onMenuClicked: (isOpen: boolean) => void,
  onMenuActionClicked: (action: string) => void
}) => {
  return (
    <div className="flex items-center justify-between p-4 h-16">
      <div>
        <Title title={activeSlide.name as string} className="text-lg" />
      </div>
      <div>
        <Options
          icon="menu"
          options={[{
            text: 'End scenario run',
            action: 'END_SCENARIO_RUN'
          }]}
          isOpen={isMenuOpen}
          onToggle={onMenuClicked}
          onOptionClicked={onMenuActionClicked}
        />
      </div>
    </div>
  );
};

export default SlidePlayerHeader;