import registerRoutes from '#core/app/helpers/registerRoutes.js';
import { registerModel } from '#core/databases/helpers/registerModel.js';
import model from './scenarios.model.js';
import routes from './scenarios.routes.js';

registerModel({
  name: 'Scenario',
  model,
  type: 'app'
});

registerRoutes(routes);


import { on } from '#core/events/index.js';

let SOCKETS = {};

on('core:io:connected', async function (socket) {
  socket.on('EVENT:SLIDE_REQUEST_ACCESS', (payload) => {
    socket.broadcast.emit(`SCENARIO:${payload.scenarioId}_EVENT:SLIDE_REQUEST_ACCESS`, {
      slideId: payload.slideId,
      lockedBy: payload.lockedBy
    })
  });
})