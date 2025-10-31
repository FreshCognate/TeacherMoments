import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './cohorts.model.js';
import routes from './cohorts.routes.js';

registerModel({
  name: 'Cohort',
  model,
  type: 'app'
});

registerRoutes(routes);