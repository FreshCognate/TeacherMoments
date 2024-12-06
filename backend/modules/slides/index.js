import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './slides.model.js';
import routes from './slides.routes.js';

registerModel({
  name: 'Slide',
  model,
  type: 'app'
});

registerRoutes(routes);