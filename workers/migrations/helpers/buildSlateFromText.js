export default function buildSlateFromText(text) {
  if (!text) return [{ type: 'paragraph', children: [{ text: '' }] }];
  return [{ type: 'paragraph', children: [{ text }] }];
}
