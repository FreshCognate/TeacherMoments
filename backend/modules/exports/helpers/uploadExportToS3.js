import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export default async ({ filePath, body, contentType, contentDisposition }) => {

  const region = process.env.STORAGE_ENDPOINT.split('.')[0];

  const s3Client = new S3Client({
    endpoint: `https://${process.env.STORAGE_ENDPOINT}`,
    region,
    credentials: {
      accessKeyId: process.env.STORAGE_KEY,
      secretAccessKey: process.env.STORAGE_SECRET
    }
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.STORAGE_NAME,
      Key: filePath,
      Body: body,
      ContentType: contentType,
      ContentDisposition: contentDisposition
    }
  });

  await upload.done();

};
