import mongoose from 'mongoose';
import Schema from './trackings.schema.js';

const ModelSchema = mongoose.Schema(Schema, { usePushEach: true });

ModelSchema.index({
  "scenario": 1
}, { background: true });

export default ModelSchema;