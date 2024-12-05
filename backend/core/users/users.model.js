import mongoose from 'mongoose';
import Schema from './users.schema.js';

const ModelSchema = mongoose.Schema(Schema, { usePushEach: true });

ModelSchema.index({
  "lastName": "text",
  "firstName": "text",
  "email": "text"
}, { background: true });

ModelSchema.pre('save', function (next) {
  if (this.email && typeof this.email === 'string') {
    this.email = this.email.toLowerCase();
  }
  next();
});

export default ModelSchema;