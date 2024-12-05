/* eslint-disable n/no-deprecated-api */
import path from 'path';

export default function (service) {
  const root = path.resolve(`./`);
  global.root = root;
  global.app = `${root}/app`;
  global.env = process.env.NODE_ENV || 'development';
  global.protocol = (global.env === 'production') ? 'https' : 'http';
  global.service = service;
};