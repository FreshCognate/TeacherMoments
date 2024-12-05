import connections from '../connections.js';

export default async (req) => {

  let tenant;
  if (req.user) {
    tenant = req.user._id;
  }

  const models = connections['app'].connection.models;

  return {
    models,
    tenant
  };
};