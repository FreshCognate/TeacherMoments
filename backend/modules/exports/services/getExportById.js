import getDownloadSignedUrl from '../../assets/helpers/getDownloadSignedUrl.js';

export default async (props, options, context) => {

  const { exportId } = props;
  const { models, user } = context;

  const exportRecord = await models.Export.findOne({
    _id: exportId,
    createdBy: user._id
  }).lean();

  if (!exportRecord) {
    throw { message: 'Export not found', statusCode: 404 };
  }

  let downloadUrl = null;

  if (exportRecord.status === 'COMPLETED' && exportRecord.filePath) {
    downloadUrl = await getDownloadSignedUrl(exportRecord.filePath);
  }

  return { export: exportRecord, downloadUrl };

};
