import Sharp from 'sharp';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import getAssetKey from '../helpers/getAssetKey.js';
import { PassThrough } from 'stream';

const SIZES = [640, 320, 160];

const resizeAndUploadImage = async ({ stream, size, asset, s3Client, Bucket }) => {
  const transformStream = Sharp()
    .resize(size)
    .on('error', (err) => console.error('Sharp processing error:', err));

  const uploadKey = getAssetKey(asset, size);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key: uploadKey,
      Body: stream.pipe(transformStream),
      ACL: 'public-read',
      ContentType: asset.mimetype
    }
  });

  await upload.done();
}

export default async ({ assetId }) => {

  const { models } = await connectDatabase();
  const asset = await models.Asset.findById(assetId);
  const assetKey = getAssetKey(asset, 'original');

  const region = process.env.STORAGE_ENDPOINT.split('.')[0];

  const s3Client = new S3Client({
    endpoint: `https://${process.env.STORAGE_ENDPOINT}`,
    region,
    credentials: {
      accessKeyId: process.env.STORAGE_KEY,
      secretAccessKey: process.env.STORAGE_SECRET
    }
  });

  const Bucket = process.env.STORAGE_NAME;

  const { Body } = await s3Client.send(new GetObjectCommand({ Bucket, Key: assetKey }));

  if (!Body || typeof Body.pipe !== 'function') {
    throw new Error('Invalid image stream from S3');
  }

  const availableSizes = [];

  for (const size of SIZES) {
    if (asset.width > size) {
      availableSizes.push(size);
    }
  }

  const resizePromises = availableSizes.map((size) => {
    const clonedStream = Body.pipe(new PassThrough());
    return resizeAndUploadImage({ stream: clonedStream, size, asset, s3Client, Bucket });
  })

  await Promise.all(resizePromises);

  asset.set('sizes', availableSizes);

  await asset.save();

}