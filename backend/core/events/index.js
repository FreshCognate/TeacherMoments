import Events from 'minivents';
const events = new Events();

const emit = events.emit;
const on = events.on;

export { emit, on };