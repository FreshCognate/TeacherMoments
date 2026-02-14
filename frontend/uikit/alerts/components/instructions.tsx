import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';
import map from 'lodash/map';

type Instruction = {
  title?: string,
  body?: string
}

const Instructions = ({
  title,
  instructions,
}: { title: string, instructions: Instruction[] }) => {
  return (
    <div className="border border-lm-2 dark:border-dm-2 my-4 py-8 px-16 rounded-lg">
      {(title) && (
        <Title title={title} className="font-bold text-xl" />
      )}
      {map(instructions, (instruction) => {
        return (
          <div className="mt-4">
            {(instruction.title) && (
              <Title title={instruction.title} />
            )}
            {(instruction.body) && (
              <Body body={instruction.body} className="text-black/60 dark:text-white/60" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Instructions;