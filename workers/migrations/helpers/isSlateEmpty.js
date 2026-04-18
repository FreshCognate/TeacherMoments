export default function isSlateEmpty(slate) {
  if (!slate || !Array.isArray(slate) || slate.length === 0) return true;
  return slate.every(node => {
    if (!node.children) return true;
    return node.children.every(child => {
      if (child.text !== undefined) return !child.text.trim();
      return isSlateEmpty([child]);
    });
  });
}
