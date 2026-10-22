import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import withConnection from '../../backend/core/databases/helpers/withConnection.js';

export default async ({ exportId }) => withConnection(async (connection) => {

  const { models } = connection;

  const exportRecord = await models.Export.findById(exportId).lean();

  if (!exportRecord) return;

  if (exportRecord.filePath) {
    const region = process.env.STORAGE_ENDPOINT.split('.')[0];

    const s3Client = new S3Client({
      endpoint: `https://${process.env.STORAGE_ENDPOINT}`,
      region,
      credentials: {
        accessKeyId: process.env.STORAGE_KEY,
        secretAccessKey: process.env.STORAGE_SECRET
      }
    });

    const command = new DeleteObjectCommand({
      Bucket: process.env.STORAGE_NAME,
      Key: exportRecord.filePath
    });

    await s3Client.send(command);
  }

  await models.Export.deleteOne({ _id: exportId });

});
