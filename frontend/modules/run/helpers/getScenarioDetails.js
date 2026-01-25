export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  const activeSlideRef = searchParams.get('slide');

  return {
    activeSlideRef
  }
}