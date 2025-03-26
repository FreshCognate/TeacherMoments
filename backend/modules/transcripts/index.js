import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './transcripts.model.js';

registerModel({
  name: 'Transcript',
  model,
  type: 'app'
});