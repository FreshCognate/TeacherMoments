import connections from '../connections.js';

export default () => {
  return connections['app'].connection;
};