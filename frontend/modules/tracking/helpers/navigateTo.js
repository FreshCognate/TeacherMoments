import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';

export default async ({ slideRef }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);

  stages.push({ slideRef: slideRef, blocksByRef: {} })

  tracking.set({ activeSlideRef: slideRef, stages });

}