import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';

const deleteStemSlidesAndBlocks = async ({ stemRef, deletedAt, models, user, session }) => {
  const slides = await models.Slide.find({ stemRef, isDeleted: false }).session(session);
  const slideRefs = slides.map(slide => slide.ref);

  await models.Block.updateMany(
    { slideRef: { $in: slideRefs }, isDeleted: false },
    { isDeleted: true, deletedAt, deletedBy: user._id }
  ).session(session);

  await models.Slide.updateMany(
    { stemRef, isDeleted: false },
    { isDeleted: true, deletedAt, deletedBy: user._id }
  ).session(session);
};

export default async (props, options, context) => {

  const { stemId } = props;

  const { models, user, connection } = context;

  await checkHasAccessToScenario({ modelId: stemId, modelType: 'Stem' }, context);

  const stem = await models.Stem.findById(stemId);

  if (!stem) throw { message: 'This stem does not exist', statusCode: 404 };

  await connection.transaction(async (session) => {
    const deletedAt = new Date();

    stem.isDeleted = true;
    stem.deletedAt = deletedAt;
    stem.deletedBy = user._id;
    await stem.save({ session });

    await deleteStemSlidesAndBlocks({ stemRef: stem.ref, deletedAt, models, user, session });
  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
