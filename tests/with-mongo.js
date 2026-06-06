import { afterAll, afterEach, beforeAll } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import getRegisteredModels from '../backend/core/databases/helpers/getRegisteredModels.js';

// Importing the module barrels triggers every registerModel() call, so the
// in-memory connection ends up with exactly the same models as production.
import '../backend/modules/index.js';
import '../backend/core/users/index.js';

// Boots a single-node replica set (so connection.transaction works everywhere),
// registers all app models onto it, and returns a live { models, connection }.
// The returned object is populated in beforeAll — read its fields inside tests.
export function setupMongo() {
  let mongoServer;
  const context = { models: null, connection: null };

  beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const connection = mongoose.createConnection(mongoServer.getUri());

    for (const { name, model, collection } of getRegisteredModels('app')) {
      connection.model(name, model, collection);
    }

    await connection.asPromise();

    context.connection = connection;
    context.models = connection.models;
  });

  afterEach(async () => {
    const collections = context.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await context.connection.close();
    await mongoServer.stop();
  });

  return context;
}
