import each from 'lodash/each.js';
import ROUTES from '../app.routes.js';
import handleValidation from './handleValidation.js';
import handleRoute from './handleRoute.js';
import Joi from 'joi';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const ROUTE_MAPPINGS = {
  all: {
    hasParam: false,
    method: 'get'
  },
  create: {
    hasParam: false,
    method: 'post'
  },
  read: {
    hasParam: true,
    method: 'get'
  },
  update: {
    hasParam: true,
    method: 'put',
  },
  delete: {
    hasParam: true,
    method: 'delete'
  }
};

export default function (app) {
  each(ROUTES, (route, routeKey) => {

    each(ROUTE_MAPPINGS, ({ hasParam, method }, routeMappingItemKey) => {
      const routeItem = route[routeMappingItemKey];
      if (routeItem && route.controller) {
        const routeItemParam = (hasParam && routeItem.param) ? `/:${routeItem.param}` : '';

        const bodyValidation = (Object.keys(routeItem.body).length) ? Joi.object(routeItem.body) : null;
        const queryValidation = (Object.keys(routeItem.query).length) ? Joi.object(routeItem.query) : null;
        const filesValidation = (Object.keys(routeItem.files).length) ? Joi.object(routeItem.files) : null;

        if (routeItem.hasCors) {
          app.options(`${process.env.API_PREFIX}${route.route}${routeItemParam}`, cors());
        }

        const limiter = rateLimit({
          windowMs: routeItem.rateLimit <= 5 ? 15 * 60 * 1000 : 1 * 60 * 1000,
          limit: routeItem.rateLimit,
          standardHeaders: 'draft-8',
          legacyHeaders: false,
          skip: () => routeItem.shouldSkipRateLimit,
          handler: (req, res, next, options) => {
            return res.status(options.statusCode).json({ message: "Too many requests, please try again later.", statusCode: options.statusCode })
          }
        });

        app[method](
          `${process.env.API_PREFIX}${route.route}${routeItemParam}`,
          cors(routeItem.hasCors),
          limiter,
          ...routeItem.middleware,
          handleValidation(routeItem.param, bodyValidation, queryValidation, filesValidation, routeItem.shouldSkipValidation),
          handleRoute({
            param: routeItem.param,
            bodyArguments: routeItem.body,
            queryArguments: routeItem.query,
            filesArguments: routeItem.files,
            props: routeItem.props,
            method: route.controller[routeMappingItemKey]
          })
        );
      }
    });
  });

  // return ROUTES;
};