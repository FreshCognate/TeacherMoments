import mongoose from 'mongoose';
import Schema from './exports.schema.js';

const ModelSchema = mongoose.Schema(Schema, { usePushEach: true });

export default ModelSchema;
