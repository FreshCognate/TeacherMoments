import getCache from "~/core/cache/helpers/getCache";
import getActiveStemRef from "./getActiveStemRef";
import find from 'lodash/find';

export default () => {
  const activeStemRef = getActiveStemRef();
  const stems = getCache('stems');
  return find(stems.data, { ref: activeStemRef });
}