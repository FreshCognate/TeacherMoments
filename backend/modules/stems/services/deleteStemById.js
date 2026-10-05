import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import deleteTriggersBySlideRefs from '../../triggers/services/deleteTriggersBySlideRefs.js';
import map from 'lodash/map.js';

const deleteStemContents = async ({ stemRef, deletedAt, session }, context) => {

  const { models, user } = context;

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

  await deleteTriggersBySlideRefs({ slideRefs, deletedAt }, {}, { ...context, session });
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

    await deleteStemContents({ stemRef: stem.ref, deletedAt, session }, context);

    let parentStemRefs = [stem.ref];

    while (parentStemRefs.length > 0) {

      const childStems = await models.Stem.find({ stemRef: { $in: parentStemRefs }, isDeleted: false }).session(session);

      if (childStems.length === 0) break;

      await models.Stem.updateMany(
        {
          _id: {
            $in: map(childStems, '_id')
          }
        },
        {
          isDeleted: true,
          deletedAt,
          deletedBy: user._id
        }
      ).session(session);

      for (const childStem of childStems) {
        await deleteStemContents({ stemRef: childStem.ref, deletedAt, session }, context);
      }

      parentStemRefs = map(childStems, 'ref');

    }
  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
