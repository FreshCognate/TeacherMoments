import TRIGGERS from '../triggers';
import map from 'lodash/map';

export default (name) => {
  return map(TRIGGERS, (trigger) => {
    return {
      isAvailable: trigger.isAvailable(),
      value: trigger.getAction(),
      text: trigger.getText(trigger),
    }
  });
}