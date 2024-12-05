import isArray from 'lodash/isArray.js';
import each from 'lodash/each.js';
import ROUTES from '../app.routes.js';

const setDefaults = (route, item) => {
  const routeItem = route[item];
  routeItem.param = routeItem.param || '';
  routeItem.body = routeItem.body || {};
  routeItem.query = routeItem.query || {};
  routeItem.files = routeItem.files || {};
  routeItem.middleware = routeItem.middleware || [];
  routeItem.props = routeItem.props || {};
  routeItem.hasCors = !!routeItem.hasCors;
  routeItem.shouldSkipValidation = !!routeItem.shouldSkipValidation;
};

const registerRoute = (route) => {
  if (global.service === 'workers') return ROUTES;
  if (!route.route) console.warn('Route needs a route attribute');
  if (!route.controller) console.warn('Route needs a controller', route.route);
  if (route.all) {
    setDefaults(route, 'all');
  }
  if (route.create) {
    setDefaults(route, 'create');
  }
  if (route.read) {
    setDefaults(route, 'read');
  }
  if (route.update) {
    setDefaults(route, 'update');
  }
  if (route.delete) {
    setDefaults(route, 'delete');
  }
  return ROUTES.push(route);
};

export default function (route) {
  if (isArray(route)) {
    each(route, registerRoute);
  } else {
    registerRoute(route);
  }
};