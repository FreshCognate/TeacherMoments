import each from 'lodash/each.js';

export default function getBlockText(block, field) {
  const nodes = block[`en-US-${field}`];

  if (!nodes || !Array.isArray(nodes)) {
    return block.name || '';
  }

  return extractText(nodes).trim() || block.name || '';
}

function extractText(nodes) {
  let text = '';
  each(nodes, (node) => {
    if (node.text !== undefined) {
      text += node.text;
    } else if (node.children) {
      text += extractText(node.children);
    }
  });
  return text;
}
