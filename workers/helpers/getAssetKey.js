export default ({ fileType, _id, name, extension }, size = 'preview') => {

  if (extension === 'gif') {
    if (size === 'placeholder' || size === 'preview') {
      extension = 'jpg';
    }
  }

  return `assets/${fileType}s/${_id}/${size}/${name}`;

};