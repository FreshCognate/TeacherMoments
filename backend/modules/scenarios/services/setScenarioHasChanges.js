import { getSockets } from "#core/io/index.js";

export default async (props, options, context) => {

  const { scenarioId } = props;
  const { models, user } = context;

  await models.Scenario.findByIdAndUpdate(scenarioId, { hasChanges: true, updatedAt: new Date(), updatedBy: user._id });

  const sockets = getSockets();

  sockets.emit(`SCENARIO:${scenarioId}_EVENT:SCENARIO_HAS_CHANGED`, {});

}