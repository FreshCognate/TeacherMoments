import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './stems.model.js';
import routes from './stems.routes.js';

registerModel({
  name: 'Stem',
  model,
  type: 'app'
});

registerModel({
  name: 'Published_Stem',
  model,
  type: 'app'
});

registerRoutes(routes);
