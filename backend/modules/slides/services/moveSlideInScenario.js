import omit from 'lodash/omit.js';
import duplicateBlocks from '../../blocks/services/duplicateBlocks.js';

export default async ({ scenario, parentId, slideId, sortOrder }, context) => {

  const { models, connection } = context;

  const existingSlide = await models.Slide.findById(slideId);

  if (!existingSlide) throw { message: "This slide does not exist", statusCode: 404 };

  let duplicatedSlide;

  await connection.transaction(async (session) => {

    const oldParentSlide = await models.Slide.findOneAndUpdate({ children: existingSlide.ref }, { $pull: { children: existingSlide.ref } }, { new: true }).session(session);

    const parentSlide = await models.Slide.findById(parentId).session(session);

    if (!parentSlide) throw { message: 'The location slide does not exist', statusCode: 404 };

    const children = parentSlide.children;

    children.splice(sortOrder, 0, existingSlide.ref);

    await parentSlide.save();


  }).catch(err => {
    throw { message: err, statusCode: 500 };
  });

  return duplicatedSlide;

}