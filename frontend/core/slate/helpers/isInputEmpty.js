import isEqual from 'lodash/isEqual';

export default function (input) {
  return isEqual(input, [{ type: 'paragraph', children: [{ text: '' }] }]);
}