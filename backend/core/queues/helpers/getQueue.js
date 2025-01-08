import QUEUES from '../queues.js';

export default (name) => {
  if (!name) return QUEUES;
  return QUEUES[name];
};