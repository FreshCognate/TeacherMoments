import { MODELS } from './registerModel.js';
import filter from 'lodash/filter.js';

export default function (type) {
  return filter(MODELS, { type });
};