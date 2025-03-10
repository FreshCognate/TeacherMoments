import has from 'lodash/has.js';
import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
export default async (props, options, context) => {

  if (has(props, 'sourceIndex') && has(props, 'destinationIndex')) {
    const { sourceIndex, destinationIndex, blockId } = props;
    if (sourceIndex !== destinationIndex) {

      const { models, user } = context;

      const block = await models.Block.findById(blockId);

      if (!block) throw { message: 'This block does not exist', statusCode: 404 };

      const blocks = await models.Block.find({ scenario: block.scenario, slideRef: block.slideRef, isDeleted: false }).sort('sortOrder');

      const result = Array.from(blocks);
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

      setScenarioHasChanges({ scenarioId: block.scenario }, {}, context);

      return removed;

    }

  }

  return null;

}