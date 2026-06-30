import React from 'react';
import { Stem } from '~/modules/stems/stems.types';
import { StemItem, OnEditPromptConditionClicked, OnRemoveConditionClicked } from '../triggers.types';
import map from 'lodash/map';
import find from 'lodash/find';
import getTextString from '~/core/slate/helpers/getTextString';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';
import TriggerStemsItem from './triggerStemsItem';

const TriggerStems = ({
  slideStems,
  items,
  prompts,
  onAddConditionClicked,
  onEditPromptConditionClicked,
  onRemoveConditionClicked
}: {
  slideStems: Stem[],
  items: StemItem[],
  prompts: any[],
  onAddConditionClicked: ({ elementRef }: { elementRef: string }) => void,
  onEditPromptConditionClicked: OnEditPromptConditionClicked,
  onRemoveConditionClicked: OnRemoveConditionClicked
}) => {
  return (
    <div className="bg-lm-2 dark:bg-dm-2 rounded-md p-2">
      {map(slideStems, (slideStem) => {
        const slideStemItem = find(items, { elementRef: slideStem.ref });
        return (
          <div key={slideStem._id} className="bg-lm-1 dark:bg-dm-1 rounded-md p-2 mb-2 last:mb-0">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60 font-bold">Stem</div>
              <div className="bg-lm-2 dark:bg-dm-2 rounded-md p-4">
                <Title title={slideStem.name} className="mb-1" />
                <Body body={getTextString(slideStem.description)} className="text-sm" />
              </div>
            </div>
            <div className="mt-2">
              <TriggerStemsItem
                prompts={prompts}
                slideStemItem={slideStemItem}
                onAddConditionClicked={() => onAddConditionClicked({ elementRef: slideStem.ref })}
                onEditPromptConditionClicked={onEditPromptConditionClicked}
                onRemoveConditionClicked={onRemoveConditionClicked}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TriggerStems;