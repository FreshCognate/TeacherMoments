import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './assets.model.js';
import routes from './assets.routes.js';

registerModel({
  name: 'Asset',
  model,
  type: 'app'
});

registerRoutes(routes);