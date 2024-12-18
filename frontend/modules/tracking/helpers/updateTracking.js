import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

export default async ({ slideRef, blockRef, update }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = stages[stages.length - 1];

  const currentBlockTracking = currentStage.blocksByRef[blockRef] ? cloneDeep(currentStage.blocksByRef[blockRef]) : {};

  extend(currentBlockTracking, update);

  currentStage.blocksByRef[blockRef] = currentBlockTracking;

  return tracking.set({ stages });

}