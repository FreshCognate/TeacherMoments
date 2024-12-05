import args from 'args';
const defaultPort = 4000;
args
  .option('port', 'The port on which the app will be running', defaultPort);

export default function () {
  let port = defaultPort;

  const flags = args.parse(process.argv);

  if (flags.port) port = flags.port;

  return port;
};