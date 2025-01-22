import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default ({ ref }) => {
  const blocks = getCache('blocks');
  const block = find(blocks.data, { ref });
  return block;
}