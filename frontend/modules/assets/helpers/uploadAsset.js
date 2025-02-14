import axios from 'axios';

export default async ({ file }) => {
  console.log('uploadAsset', file);
  const asset = await axios.post('/api/assets', { name: file.name, fileType: file.type });
  console.log(asset);
  // await axios.post('/api/assets/signedUrl', {
  //   size: file.size,
  //   type: file.type
  // });

  return "EVENT";
}