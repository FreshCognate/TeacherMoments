import axios from 'axios';
import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import setAssetToUploaded from '../../../backend/modules/assets/services/setAssetToUploaded.js';

const MIME_FROM_EXTENSION = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

const EXTENSION_FROM_MIME = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

function deriveMimetype(url, contentType) {
  if (contentType && EXTENSION_FROM_MIME[contentType.toLowerCase()]) {
    return contentType.toLowerCase();
  }
  const cleanUrl = url.split('?')[0].split('#')[0];
  const ext = cleanUrl.split('.').pop().toLowerCase();
  return MIME_FROM_EXTENSION[ext] || 'image/jpeg';
}

function deriveName(url) {
  const cleanUrl = url.split('?')[0].split('#')[0];
  const filename = cleanUrl.split('/').pop() || 'image';
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  return nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_') || 'image';
}

export default async function downloadAndUploadImage({ url, models, createdBy }) {

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    maxContentLength: 50 * 1024 * 1024,
  });

  const buffer = Buffer.from(response.data);
  const mimetype = deriveMimetype(url, response.headers['content-type']);
  const extension = EXTENSION_FROM_MIME[mimetype];
  const name = deriveName(url);

  let width = 0;
  let height = 0;
  let orientation = 'landscape';

  try {
    const metadata = await sharp(buffer).metadata();
    width = metadata.width || 0;
    height = metadata.height || 0;
    orientation = height > width ? 'portrait' : 'landscape';
  } catch (error) {
    // SVGs and some formats can't be read by sharp - use defaults
  }

  const asset = await models.Asset.create({
    name,
    fileType: 'image',
    extension,
    mimetype,
    width,
    height,
    orientation,
    sizes: [],
    isUploading: true,
    isProcessing: false,
    hasBeenProcessed: false,
    createdBy,
  });

  const region = process.env.STORAGE_ENDPOINT.split('.')[0];
  const s3Client = new S3Client({
    endpoint: `https://${process.env.STORAGE_ENDPOINT}`,
    region,
    credentials: {
      accessKeyId: process.env.STORAGE_KEY,
      secretAccessKey: process.env.STORAGE_SECRET,
    },
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.STORAGE_NAME,
      Key: `assets/images/${asset._id}/original/${name}.${extension}`,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
    },
  });

  await upload.done();

  await setAssetToUploaded({ assetId: asset._id }, {}, { models });

  return asset;
}
