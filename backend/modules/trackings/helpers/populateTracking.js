export default async ({ tracking }, { models }) => {
  for (const stage of tracking.stages) {
    const blockRefs = Object.values(stage.blocksByRef);
    const audioIds = blockRefs.map(block => block.audio).filter(id => id);

    const audioDocs = await models.Asset.find({ _id: { $in: audioIds } });

    blockRefs.forEach(block => {
      block.audio = audioDocs.find(audio => audio._id.equals(block.audio));
    });
  }
  return tracking;
}