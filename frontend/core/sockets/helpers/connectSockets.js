import { io } from "socket.io-client";
import getCache from "~/core/cache/helpers/getCache";
import addToast from "~/core/dialogs/helpers/addToast";
let removeReconnectionToast = null;
import SOCKETS from '../sockets';

export default () => {
  const socket = io(window.location.origin, {
    path: '/api/sockets',
    transports: ["polling"],
    reconnection: true,
    reconnectionDelay: 200,
    reconnectionAttempts: 20,
    randomizationFactor: 0
  });
  socket.on('connect', () => {
    console.log('Sockets: connected');
    if (removeReconnectionToast) {
      removeReconnectionToast({});
    }
  });
  socket.on(`disconnect`, (message) => {
    console.log(`Sockets: disconnected due to ${message}`);
    const authentication = getCache('authentication');

    if (authentication && authentication.data && authentication.data.role !== 'user') {
      addToast({ title: 'TM is upgrading', body: 'Reconnecting...', icon: 'live', timeout: 10000 }, ({ removeToast }) => {
        removeReconnectionToast = removeToast;
      });
    }
  });

  SOCKETS.connection = socket;
  return SOCKETS.connection;
}