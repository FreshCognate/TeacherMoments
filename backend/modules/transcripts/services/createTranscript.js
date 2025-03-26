export default async (props, options, context) => {

  const {
    language,
    duration,
    text,
    segments,
    assetId,
    createdBy
  } = props;

  const { models } = context;

  const newTranscriptObject = {
    language,
    duration,
    text,
    segments,
    asset: assetId,
    createdBy
  };

  const transcript = await models.Transcript.create(newTranscriptObject);

  return transcript;

};