import getCache from "~/core/cache/helpers/getCache"
import filter from 'lodash/filter';

export default ({ slideRef }) => {
  const blocks = getCache('blocks');
  const slideBlocks = filter(blocks.data, { slideRef });
  return slideBlocks;
}