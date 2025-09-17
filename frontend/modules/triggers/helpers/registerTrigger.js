import TRIGGERS from '../triggers';

export default (name, trigger) => {
  // if (TRIGGERS[name]) return console.warn(`This trigger already exists: ${name}`);
  TRIGGERS[name] = trigger;
}