import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (filePath, { maxAttempts = 10, interval = 1000 } = {}) => {

  const region = process.env.STORAGE_ENDPOINT.split('.')[0];

  const s3Client = new S3Client({
    endpoint: `https://${process.env.STORAGE_ENDPOINT}`,
    region,
    credentials: {
      accessKeyId: process.env.STORAGE_KEY,
      secretAccessKey: process.env.STORAGE_SECRET
    }
  });

  const command = new HeadObjectCommand({
    Bucket: process.env.STORAGE_NAME,
    Key: filePath
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await s3Client.send(command);
      return true;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`File not available after ${maxAttempts} attempts: ${filePath}`);
      }
      await delay(interval);
    }
  }

};
