import axios from 'axios';

export default async ({ file }) => {
  const asset = await axios.post('/api/assets', { name: file.name, mimetype: file.type });

  const signedUrl = asset.data.signedUrl;

  const uploadResponse = await axios.put(signedUrl, file, {
    onUploadProgress: (event) => {
      console.log(event);
    }
  });

  return "EVENT";
}