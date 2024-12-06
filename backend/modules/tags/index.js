import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './tags.model.js';
import routes from './tags.routes.js';

registerModel({
  name: 'Tag',
  model,
  type: 'app'
});

registerRoutes(routes);