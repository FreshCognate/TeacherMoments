import getStemsByStemRef from "../helpers/getStemsByStemRef";
import map from 'lodash/map';
import { Stem } from "../stems.types";

export default ({ stem }: { stem: Stem }) => {
  const childStems = getStemsByStemRef({ stemRef: stem.ref });
  return {
    branchingOptions: {
      type: 'TriggerStems',
      label: 'Stems'
    },
    defaultBranchingStemRef: {
      type: 'Select',
      label: 'If no condition is met, default to this stem',
      conditions: [{
        type: 'hasConditionlessStem',
        shouldHideField: true
      }],
      options: [
        { value: '', text: 'None' },
        ...map(childStems, (childStem) => {
          return {
            value: childStem.ref,
            text: childStem.name
          };
        })
      ]
    }
  }
}