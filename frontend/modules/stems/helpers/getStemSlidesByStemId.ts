import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';

export default ({ stemId }: { stemId: string }) => {
  const stems = getCache('stems');
  const stem = find(stems.data, { _id: stemId });
  if (!stem) return [];
  const slides = getCache('slides');
  return filter(slides.data, { stemRef: stem.ref });
}
