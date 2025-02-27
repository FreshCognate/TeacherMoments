import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default ({ slideRef }) => {
  const tracking = getCache('tracking');

  const slideTracking = find(tracking.data.stages, { slideRef });

  return slideTracking;

}