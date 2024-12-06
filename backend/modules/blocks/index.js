import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './blocks.model.js';
import routes from './blocks.routes.js';

registerModel({
  name: 'Block',
  model,
  type: 'app'
});

registerRoutes(routes);