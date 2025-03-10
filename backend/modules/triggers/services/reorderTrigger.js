import has from 'lodash/has.js';
import setScenarioHasChanges from '../../scenarios/services/setScenarioHasChanges.js';
export default async (props, options, context) => {

  if (has(props, 'sourceIndex') && has(props, 'destinationIndex')) {
    const { sourceIndex, destinationIndex, triggerId } = props;
    if (sourceIndex !== destinationIndex) {

      const { models, user } = context;

      const trigger = await models.Trigger.findById(triggerId);

      if (!trigger) throw { message: 'This trigger does not exist', statusCode: 404 };

      const triggers = await models.Trigger.find({
        scenario: trigger.scenario,
        isDeleted: false,
        elementRef: trigger.elementRef,
        event: trigger.event
      }).sort('sortOrder');

      const result = Array.from(triggers);
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

      setScenarioHasChanges({ scenarioId: trigger.scenario }, {}, context);

      return removed;

    }

  }

  return null;

}