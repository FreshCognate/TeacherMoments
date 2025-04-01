import find from 'lodash/find';

export default ({ blocksByRef }) => {
  return !find(blocksByRef, { isComplete: false });
}