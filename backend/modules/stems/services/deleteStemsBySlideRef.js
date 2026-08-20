import map from 'lodash/map.js';
import deleteTriggersBySlideRefs from '../../triggers/services/deleteTriggersBySlideRefs.js';

export default async (props, options, context) => {

  const { slideRef, deletedAt } = props;

  const { models, user, session } = context;

  let parentSlideRefs = [slideRef];

  while (parentSlideRefs.length > 0) {

    const childStems = await models.Stem.find({ slideRef: { $in: parentSlideRefs }, isDeleted: false }).session(session);

    if (childStems.length === 0) break;

    const childStemRefs = map(childStems, 'ref');
    const childStemSlides = await models.Slide.find({ stemRef: { $in: childStemRefs }, isDeleted: false }).session(session);
    const childStemSlideRefs = map(childStemSlides, 'ref');

    await models.Stem.updateMany(
      { _id: { $in: map(childStems, '_id') } },
      { isDeleted: true, deletedAt, deletedBy: user._id },
      { session }
    );

    await models.Slide.updateMany(
      { _id: { $in: map(childStemSlides, '_id') } },
      { isDeleted: true, deletedAt, deletedBy: user._id },
      { session }
    );

    await models.Block.updateMany(
      { slideRef: { $in: childStemSlideRefs }, isDeleted: false },
      { isDeleted: true, deletedAt, deletedBy: user._id },
      { session }
    );

    await deleteTriggersBySlideRefs({ slideRefs: childStemSlideRefs, deletedAt }, {}, context);

    parentSlideRefs = childStemSlideRefs;

  }

};
