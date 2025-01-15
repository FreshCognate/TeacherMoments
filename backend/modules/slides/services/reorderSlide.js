import has from 'lodash/has.js';
export default async (props, options, context) => {
  // Reordering does not work with branching
  return null;
  if (has(props, 'sourceIndex') && has(props, 'destinationIndex')) {
    const { sourceIndex, destinationIndex, slideId } = props;
    if (sourceIndex !== destinationIndex) {

      const { models, user } = context;

      const slide = await models.Slide.findById(slideId);

      if (!slide) throw { message: 'This slide does not exist', statusCode: 404 };

      const slides = await models.Slide.find({ scenario: slide.scenario, isDeleted: false });

      const result = Array.from(slides);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);

      let index = 0;
      for (const item of result) {
        item.sortOrder = index;
        item.updatedAt = new Date();
        item.updatedBy = user._id;
        await item.save();
        index++;
      }

      return removed;

    }

  }

  return null;

}