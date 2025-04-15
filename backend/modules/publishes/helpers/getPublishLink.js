import slugify from 'slugify';

const checkPublishLinkUniqueness = async function ({ publishLink, Model, suffix }) {
  const publishLinkToCheck = (suffix) ? `${publishLink}-${suffix}` : publishLink;

  const existingModel = await Model.findOne({ publishLink: publishLinkToCheck });

  if (existingModel) {
    const updatedSuffix = (suffix) ? suffix + 1 : suffix = 1;
    return await checkPublishLinkUniqueness({ publishLink, Model, suffix: updatedSuffix });
  } else {
    return publishLinkToCheck;
  }

};

export default async function ({ name, Model }) {

  const tempPublishLink = slugify(name.substring(0, 38), { lower: true, strict: true });

  const suffix = null;

  return await checkPublishLinkUniqueness({ publishLink: tempPublishLink, Model, suffix });

};