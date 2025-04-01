import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './runs.model.js';

registerModel({
  name: 'Run',
  model,
  type: 'app'
});