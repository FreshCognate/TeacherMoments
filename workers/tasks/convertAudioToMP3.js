import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import getAssetKey from '../helpers/getAssetKey.js';
import ffmpeg from 'fluent-ffmpeg';
import fse from 'fs-extra';

const downloadAsset = async ({ Bucket, Key, asset, s3Client }) => {

  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  try {
    await fse.ensureDir(`./tmp/${asset._id}`);
    const { Body } = await s3Client.send(command);
    const writeStream = fse.createWriteStream(`./tmp/${asset._id}/${asset.name}.${asset.extension}`);
    await new Promise((resolve, reject) => {
      Body.pipe(writeStream);
      Body.on('error', reject);
      writeStream.on('finish', resolve);
    });

  } catch (err) {
    console.error('Error downloading file:', err);
  }
}

const convertToMP3 = async ({ stream, asset, s3Client, Bucket, Key }) => {

  return new Promise(async (resolve, reject) => {

    ffmpeg(`./tmp/${asset._id}/${asset.name}.${asset.extension}`)
      .toFormat('mp3')
      .on('end', async () => {

        asset.set('extension', 'mp3');
        asset.set('mimetype', 'audio/mpeg');

        const fileContent = await fse.readFile(`./tmp/${asset._id}/${asset.name}.${asset.extension}`);

        const uploadKey = getAssetKey(asset, 'original');

        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket,
            Key: uploadKey,
            Body: fileContent,
            ACL: 'public-read',
            ContentType: asset.mimetype
          }
        });

        await upload.done();

        const deleteCommand = new DeleteObjectCommand({
          Bucket,
          Key,
        });

        await s3Client.send(deleteCommand);

        resolve();

      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(`./tmp/${asset._id}/${asset.name}.mp3`);
  })

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

  await downloadAsset({ Bucket, Key: assetKey, asset, s3Client });

  await convertToMP3({ asset, s3Client, Bucket, Key: assetKey })

  await asset.save();

}