import mongoose from 'mongoose';
import Schema from './trackings.schema.js';

const ModelSchema = mongoose.Schema(Schema, { usePushEach: true });

ModelSchema.index({
  "cohort": 1,
  "user": 1
}, { background: true });

ModelSchema.index({
  "cohort": 1,
}, { background: true });

ModelSchema.index({
  "user": 1,
}, { background: true });

export default ModelSchema;