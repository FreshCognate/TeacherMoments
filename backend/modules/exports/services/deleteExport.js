import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export default async (props, options, context) => {

  const { exportId } = props;
  const { models, user } = context;

  const exportRecord = await models.Export.findOne({
    _id: exportId,
    createdBy: user._id
  });

  if (!exportRecord) {
    throw { message: 'Export not found', statusCode: 404 };
  }

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

  return { success: true };

};
