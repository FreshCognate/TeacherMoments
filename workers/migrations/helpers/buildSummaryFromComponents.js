import htmlToSlate from './htmlToSlate.js';

const DEFAULT_SUMMARY = [{ type: 'paragraph', children: [{ text: '' }] }];

export default function buildSummaryFromComponents(components) {
  if (!components || components.length === 0) return DEFAULT_SUMMARY;

  const merged = [];
  for (const component of components) {
    const html = component.html || component.prompt;
    if (!html) continue;
    const { slate } = htmlToSlate(html);
    merged.push(...slate);
  }

  return merged.length > 0 ? merged : DEFAULT_SUMMARY;
}
