export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    selectedSlideId: searchParams.get('slide')
  }
}