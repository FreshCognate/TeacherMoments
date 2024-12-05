import mongoose from 'mongoose';
import each from 'lodash/each.js';
import connections from '../connections.js';
import getRegisteredModels from './getRegisteredModels.js';

export default async function () {

  let connectionString = process.env.MONGODB_URL;

  connections['app'] = {};

  connections['app'].connection = mongoose.createConnection(connectionString, {});
  connections['app'].lastAccessed = new Date();
  connections['app'].connection.refresh = () => {
    connections['app'].lastAccessed = new Date();
  }

  const models = getRegisteredModels('app');

  each(models, (model) => {
    connections['app'].connection.model(model.name, model.model, model.collection);
  });

  await connections['app'].connection.asPromise();

  return connections['app'].connection;

};