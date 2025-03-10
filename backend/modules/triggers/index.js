import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './triggers.model.js';
import routes from './triggers.routes.js';

registerModel({
  name: 'Trigger',
  model,
  type: 'app'
});

registerModel({
  name: 'Published_Trigger',
  model,
  type: 'app'
});

registerRoutes(routes);