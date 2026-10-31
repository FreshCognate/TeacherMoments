import getChildStems from "../helpers/getChildStems";
import map from 'lodash/map';
import { Stem } from "../stems.types";

export default ({ stem }: { stem: Stem }) => {
  const childStems = getChildStems({ stem });
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