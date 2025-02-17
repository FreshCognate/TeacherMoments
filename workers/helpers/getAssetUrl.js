export default ({ fileType, _id, name, extension }, size = 'preview') => {

  const storageName = process.env.STORAGE_NAME;
  const storageEndpoint = process.env.STORAGE_ENDPOINT;

  const urlRoot = `https://${storageName}.${storageEndpoint}`;

  if (extension === 'gif') {
    if (size === 'placeholder' || size === 'preview') {
      extension = 'jpg';
    }
  }

  return `${urlRoot}/assets/${fileType}s/${_id}/${size}/${name}`;

};