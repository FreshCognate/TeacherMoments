import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const ConsentSlide = ({
  scenario
}) => {
  return (
    <div>
      <Title title={"Consent Agreement"} className="text-xl mb-2" />
      <Body body={getString({ model: scenario, field: 'consent' })} className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60" />
    </div>
  );
};

export default ConsentSlide;