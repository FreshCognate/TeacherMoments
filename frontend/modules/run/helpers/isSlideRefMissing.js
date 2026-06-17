import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

const SPECIAL_SLIDE_REFS = ['CONSENT', 'SUMMARY'];

export default function isSlideRefMissing({ slideRef, slides }) {
  if (!slideRef || SPECIAL_SLIDE_REFS.includes(slideRef)) {
    return false;
  }

  if (isEmpty(slides)) {
    return false;
  }

  return !find(slides, { ref: slideRef });
}
