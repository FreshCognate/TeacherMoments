import TRIGGERS from '../triggers';

export default (name) => {
  if (!TRIGGERS[name]) console.warn(`This trigger does not exist: ${name}`);
  return TRIGGERS[name];
}