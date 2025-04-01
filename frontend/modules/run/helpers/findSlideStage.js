import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default ({ slideRef }) => {
  const run = getCache('run');

  const slideStage = find(run.data.stages, { slideRef });

  return slideStage;

}