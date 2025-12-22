import SOCKETS from '../sockets';

export default () => {
  if (SOCKETS.connection) {
    console.log('Sockets: disconnecting');
    SOCKETS.connection.removeAllListeners();
    SOCKETS.connection.disconnect();
    SOCKETS.connection = null;
  }
}
