const DEFAULT_LANGUAGE = 'en-US';

export default (model, field) => {
  const value = model[`${DEFAULT_LANGUAGE}-${field}`];
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) {
    return value.some(node => node.children?.some(child => child.text?.trim()));
  }
  return false;
};
