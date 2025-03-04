import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default () => {
  const tracking = getCache('tracking');

  const currentStage = find(tracking.data.stages, { slideRef: tracking.data.activeSlideRef });

  return currentStage;

}