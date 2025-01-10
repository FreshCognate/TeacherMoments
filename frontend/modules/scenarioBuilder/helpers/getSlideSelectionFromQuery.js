export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  return JSON.parse(searchParams.get('slideSelection')) || [];
}