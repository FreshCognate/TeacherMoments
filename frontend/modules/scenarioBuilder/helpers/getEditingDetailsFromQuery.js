export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    isEditing: searchParams.get('isEditing'),
    layer: searchParams.get('layer') === 'root' ? 'root' : parseInt(searchParams.get('layer')),
    slide: searchParams.get('slide')
  }
}