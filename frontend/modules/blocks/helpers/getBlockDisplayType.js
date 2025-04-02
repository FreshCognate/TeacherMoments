import blocks from '../../../../config/blocks.json';
import find from 'lodash/find';

export default (block) => {
  const blockDetails = find(blocks, { blockType: block.blockType });
  return blockDetails.displayType;
}