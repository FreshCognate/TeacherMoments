import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';

export default ({ stemRef }: { stemRef: string }) => {
  const stems = getCache('stems').data;
  const filteredStems = filter(stems, { stemRef });
  return filteredStems;
}