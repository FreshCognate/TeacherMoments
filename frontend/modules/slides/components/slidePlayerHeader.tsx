import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';
import Options from '~/uikit/dropdowns/components/options';

const SlidePlayerHeader = ({
  activeSlide,
  isMenuOpen,
  onMenuClicked,
  onMenuActionClicked
}) => {
  return (
    <div className="flex items-center justify-between p-4 h-16">
      <div>
        <Title title={activeSlide.name} className="text-lg" />
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