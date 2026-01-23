import http from 'http';
import { emit } from './events/index.js';
import express from 'express';
import mongoose from 'mongoose';
mongoose.set('strictPopulate', false);
import passport from 'passport';
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import getRoutes from '#core/app/helpers/getRoutes.js';
import setGlobals from '#core/server/helpers/setGlobals.js';
import getPort from '#core/server/helpers/getPort.js';

setGlobals('server');

import connectDatabase from '#core/databases/helpers/connectDatabase.js';
import hasDatabaseConnection from '#core/databases/middleware/hasDatabaseConnection.js';

// // Express middleware
import methodOverride from 'method-override';

import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import boolParser from 'express-query-boolean';
import initialise from './passport/initialise.js';
import '../modules/index.js';

const startServer = async function () {
  await connectDatabase();
  initialise(passport);

  const app = express();

  const port = getPort();

  app.set('port', port);
  app.set('trust proxy', process.env.NODE_ENV === 'production' ? 2 : 1);

  app.use(compression());

  app.use(morgan('dev', {
    skip: function (req, res) {
      if (process.env.LOGS) return;
      return (res.statusCode < 400);
    }
  }));

  app.use(methodOverride());
  const upload = multer({ dest: './tmp/' });
  app.use(upload.fields([{ name: 'uploads' }]));
  app.use(cookieParser());
  app.use(bodyParser.json({
    limit: '50mb',
    verify: function (req, res, buf) {
      req.rawBody = buf;
    }
  }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(boolParser());
  app.disable('x-powered-by');

  app.use(hasDatabaseConnection);

  const sessionsSecret = process.env.SESSION_SECRET;
  const sessionsMaxAgeDays = 30;
  const sessionsMaxAgeMs = sessionsMaxAgeDays * 24 * 60 * 60 * 1000;

  const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    ttl: sessionsMaxAgeDays * 24 * 60 * 60,
    collection: "sessions"
  });

  app.use(session({
    name: 'express.sid',
    secret: sessionsSecret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: sessionsMaxAgeMs,
    }
  }));

  const router = express.Router();

  app.use(passport.initialize());
  app.use(passport.session());

  const server = http.createServer(app);

  getRoutes(app);

  app.get('/api/*', function (req, res, next) {

    if (req.error && req.status) {
      return res.status(req.status).json({ message: req.error, statusCode: req.status });
    }

    return res.status(404).json({ message: 'This API does not exist', statusCode: 404 });

  });

  app.get('/*', function (req, res, next) {

    if (req.error && req.status) {
      return res.status(req.status).json({ message: req.error, statusCode: req.status });
    }

    return res.status(404).json({ message: "This API does not exist", statusCode: 404 });

  });

  app.post('/*', function (req, res, next) {
    if (req.error && req.status) {
      return res.status(req.status).json({ message: req.error, statusCode: req.status });
    }
    return res.status(404).json({ message: "This API does not exist", statusCode: 404 });
  });

  app.put('/*', function (req, res, next) {
    if (req.error && req.status) {
      return res.status(req.status).json({ message: req.error, statusCode: req.status });
    }
    return res.status(404).json({ message: "This API does not exist", statusCode: 404 });
  });

  app.delete('/*', function (req, res, next) {
    if (req.error && req.status) {
      return res.status(req.status).json({ message: req.error, statusCode: req.status });
    }
    return res.status(404).json({ message: "This API does not exist", statusCode: 404 });
  });

  if (app.get('env') === 'development') {
    app.use(errorHandler());
  }

  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    emit('core:server:started', { server, sessionStore });
  });

};

startServer();