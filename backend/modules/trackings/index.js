import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './trackings.model.js';

registerModel({
  name: 'Tracking',
  model,
  type: 'app'
});