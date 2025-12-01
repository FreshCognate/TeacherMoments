import crypto from 'crypto';

export default () => {
  return crypto.randomBytes(16).toString('hex');
}