import getCache from "~/core/cache/helpers/getCache"
import filter from 'lodash/filter';
import keyBy from 'lodash/keyBy';
import blocksDetail from '../../../../config/blocks.json';

export default ({ slideRef }) => {
  const blocks = getCache('blocks');
  const blocksByBlockType = keyBy(blocksDetail, 'blockType');

  const slideBlocks = filter(blocks.data, (block) => {
    if (block.slideRef === slideRef) {

      if (blocksByBlockType[block.blockType].displayType === 'PROMPT') {
        return block;
      }

    }
  });
  return slideBlocks;
}