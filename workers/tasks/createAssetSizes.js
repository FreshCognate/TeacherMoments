import Sharp from 'sharp';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import getAssetKey from '../helpers/getAssetKey.js';
import { PassThrough } from 'stream';

export default async ({ assetId }) => {

  const { models } = await connectDatabase();
  const asset = await models.Asset.findById(assetId);
  const assetKey = getAssetKey(asset, 'original');

  console.log('Starting image processing...');

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

  const passThrough = new PassThrough();

  // Process image using sharp (without excessive memory use)
  const transformStream = Sharp()
    .resize(320) // Keep aspect ratio
    .on('error', (err) => console.error('Sharp processing error:', err));

  Body.pipe(transformStream).pipe(passThrough);

  const uploadKey = getAssetKey(asset, '320');

  // Upload the transformed image stream using `@aws-sdk/lib-storage`
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key: uploadKey,
      Body: passThrough, // Stream output directly to S3
      ACL: 'public-read',
      ContentType: asset.mimetype
    }
  });

  await upload.done();

}