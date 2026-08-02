import find from 'lodash/find';
import getString from '~/modules/ls/helpers/getString';

// Selections are stored by the option's stable _id. Resolve one to its display
// label: the option's `value`, falling back to its localized `text`. Legacy
// entries stored by value are matched by value, and anything that no longer
// resolves is returned unchanged.
export default function getOptionLabel({ options, optionId }) {
  const matchedOption = find(options, (option) => String(option._id) === String(optionId)) ||
    find(options, (option) => option.value === optionId);

  if (!matchedOption) return String(optionId);

  return matchedOption.value || getString({ model: matchedOption, field: 'text' }) || String(optionId);
}
