import getTrigger from "./getTrigger"

export default (trigger) => {
  const triggerItem = getTrigger(trigger.action);

  if (!triggerItem) return console.warn(`This trigger does not exist: ${trigger.action}`);
  return triggerItem.getDescription(trigger);
}