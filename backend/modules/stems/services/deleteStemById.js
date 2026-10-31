import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
import checkHasAccessToScenario from '../../scenarios/helpers/checkHasAccessToScenario.js';
import deleteTriggersBySlideRefs from '../../triggers/services/deleteTriggersBySlideRefs.js';
import map from 'lodash/map.js';
import flatMap from 'lodash/flatMap.js';
import uniq from 'lodash/uniq.js';
import difference from 'lodash/difference.js';

const getChildStemRefs = (stems) => uniq(flatMap(stems, (stem) => {
  return map(stem.branchingOptions, (branchingOption) => String(branchingOption.stemRef));
}));

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

    await models.Stem.updateMany(
      { 'branchingOptions.stemRef': stem.ref },
      { $pull: { branchingOptions: { stemRef: stem.ref } } }
    ).session(session);

    await models.Stem.updateMany(
      { defaultBranchingStemRef: stem.ref },
      { defaultBranchingStemRef: null }
    ).session(session);

    let childStemRefs = getChildStemRefs([stem]);

    while (childStemRefs.length > 0) {

      const linkingStems = await models.Stem.find({
        'branchingOptions.stemRef': { $in: childStemRefs },
        isDeleted: false
      }).session(session);

      const linkedStemRefs = getChildStemRefs(linkingStems);

      const childStems = await models.Stem.find({
        ref: { $in: difference(childStemRefs, linkedStemRefs) },
        isDeleted: false
      }).session(session);

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

      childStemRefs = getChildStemRefs(childStems);

    }
  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  setScenarioHasChanges({ scenarioId: stem.scenario }, {}, context);

  return stem;

};
