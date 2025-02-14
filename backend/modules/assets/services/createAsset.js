import getUploadSignedUrl from "../helpers/getUploadSignedUrl.js";
import getFileType from '../helpers/getFileType.js';
import getFileExtension from '../helpers/getFileExtension.js';
import sanitizeFileName from "../helpers/sanitizeFileName.js";

export default async (props, options, context) => {

  const { name, mimetype } = props;

  const { models, user } = context;

  const fileType = getFileType(mimetype);

  const extension = getFileExtension(mimetype);

  const newAssetObject = {
    name: sanitizeFileName(name),
    fileType,
    extension,
    createdBy: user._id,
    isUploading: true,
    mimetype,
  };

  const asset = await models.Asset.create(newAssetObject);

  // When creating a new asset we should create a signing url.
  const signedUrl = await getUploadSignedUrl(`assets/${fileType}s/${asset._id}/original/${name}`);

  return { asset, signedUrl };

};