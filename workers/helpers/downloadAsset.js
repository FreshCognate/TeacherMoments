import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import getAssetKey from "./getAssetKey.js";
import fse from 'fs-extra';

export default async ({ asset }) => {

  const Key = getAssetKey(asset, 'original');

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


  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  try {
    await fse.ensureDir(`./tmp/${asset._id}`);
    const { Body } = await s3Client.send(command);
    let assetPath = `./tmp/${asset._id}/${asset.name}.${asset.extension}`;
    const writeStream = fse.createWriteStream(assetPath);
    await new Promise((resolve, reject) => {
      Body.pipe(writeStream);
      Body.on('error', reject);
      writeStream.on('finish', resolve);
    });

    return {
      assetPath
    }

  } catch (err) {
    console.error('Error downloading file:', err);
  }
}