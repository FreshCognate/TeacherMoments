import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './scenarios.model.js';
import routes from './scenarios.routes.js';

registerModel({
  name: 'Scenario',
  model,
  type: 'app'
});

registerRoutes(routes);