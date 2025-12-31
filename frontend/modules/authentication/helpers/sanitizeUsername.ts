export default (username: string): string => {
  return username
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z-]/g, '');
}