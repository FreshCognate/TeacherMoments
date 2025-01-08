import SOCKETS from '../sockets';


export default () => {
  const promise = new Promise((resolve) => {
    const checkSockets = () => {
      if (SOCKETS.connection) {
        resolve(SOCKETS.connection);
      } else {
        setTimeout(() => {
          checkSockets();
        }, 100);
      }
    };
    checkSockets();
  });
  return promise;
}