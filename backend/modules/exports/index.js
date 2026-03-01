import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './exports.model.js';
import routes from './exports.routes.js';

registerModel({
  name: 'Export',
  model,
  type: 'app'
});

registerRoutes(routes);
