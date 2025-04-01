import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';

const SlidePlayerHeader = ({
  activeSlide,
  hasBackButton,
  onPreviousSlideClicked,
}) => {
  return (
    <div className="flex items-center justify-between p-4 h-16">
      <div>
        <Title title={activeSlide.name} className="text-lg" />
      </div>
      <div>
        <FlatButton icon="menu" />
      </div>
    </div>
  );
};

export default SlidePlayerHeader;