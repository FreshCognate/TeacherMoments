import each from 'lodash/each';
import find from 'lodash/find';
import some from 'lodash/some';
import getStemsByStemRef from './getStemsByStemRef';
import { Stem } from '../stems.types';

type StemError = {
  message: string,
  elementType: string,
  elementId: string
};

export default (stem: Stem) => {
  const errors: StemError[] = [];
  const defaultError = { elementType: 'STEM', elementId: stem._id };

  const childStems = getStemsByStemRef({ stemRef: stem.ref });

  if (childStems.length > 0) {
    const hasPromptConditions = some(stem.branchingOptions, branchingOption => {
      return some(branchingOption.conditions, condition => condition.prompts?.length > 0);
    });

    if (!hasPromptConditions) {
      errors.push({ ...defaultError, message: 'Stem has child stems but no prompt conditions set up' });
    }

    each(childStems, (childStem: Stem) => {
      if (childStem.ref === stem.defaultBranchingStemRef) return;

      const branchingOption = find(stem.branchingOptions, { elementRef: childStem.ref });
      const hasPromptCondition = some(branchingOption?.conditions, condition => condition.prompts?.length > 0);

      if (!hasPromptCondition) {
        errors.push({ ...defaultError, message: `Stem "${childStem.name}" cannot be navigated to` });
      }
    });
  }

  return errors;
};
