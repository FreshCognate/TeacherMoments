export default ({ fileType, _id, name, extension }, size = 'preview') => {
  let storageName = '';
  let storageEndpoint = '';

  if (typeof window !== 'undefined') {
    storageName = window.STORAGE_NAME;
    storageEndpoint = window.STORAGE_ENDPOINT;
  } else {
    storageName = process.env.STORAGE_NAME;
    storageEndpoint = process.env.STORAGE_ENDPOINT;
  }

  const urlRoot = `https://${storageName}.${storageEndpoint}`;

  if (extension === 'gif') {
    if (size === 'placeholder' || size === 'preview') {
      extension = 'jpg';
    }
  }

  return `${urlRoot}/assets/${fileType}s/${_id}/${size}/${name}.${extension}`;

};