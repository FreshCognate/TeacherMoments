import find from 'lodash/find';
import getString from '~/modules/ls/helpers/getString';

export default function getOptionLabel({ options, optionId }) {
  const matchedOption = find(options, (option) => String(option._id) === String(optionId)) ||
    find(options, (option) => option.value === optionId);

  if (!matchedOption) return null;

  return matchedOption.value || getString({ model: matchedOption, field: 'text' }) || String(optionId);
}
