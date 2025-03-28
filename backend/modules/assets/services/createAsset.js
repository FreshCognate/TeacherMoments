import getUploadSignedUrl from "../helpers/getUploadSignedUrl.js";
import getFileType from '../helpers/getFileType.js';
import getFileExtension from '../helpers/getFileExtension.js';
import sanitizeFileName from "../helpers/sanitizeFileName.js";

export default async (props, options, context) => {

  const { name, width, height, orientation, mimetype, isTemporary } = props;

  const { models, user } = context;

  const fileType = getFileType(mimetype);

  const extension = getFileExtension(mimetype);

  const sanitizedFileName = sanitizeFileName(name);

  const sanitizedFileNameSplit = sanitizedFileName.split('.');
  const assetFileName = sanitizedFileNameSplit.slice(0, sanitizedFileNameSplit.length - 1).join(".");

  const newAssetObject = {
    name: assetFileName,
    fileType,
    extension,
    createdBy: user._id,
    isUploading: true,
    width,
    height,
    orientation,
    mimetype,
    isTemporary
  };

  const asset = await models.Asset.create(newAssetObject);

  // When creating a new asset we should create a signing url.
  const signedUrl = await getUploadSignedUrl({
    assetPath: `assets/${fileType}s/${asset._id}/original/${sanitizedFileName}`,
    ACL: 'public-read',
    ContentType: mimetype
  });

  return { asset, signedUrl };

};