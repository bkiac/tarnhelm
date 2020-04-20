import cors from 'cors';

/**
 * Set up Express and WebSocket server before loading and defining routes
 * https://github.com/HenningM/express-ws#usage
 */
import express from './wexpress';

import routes from './routes';
import config from './config';
import { log, createStatsLogger } from './lib/utils';

const { app, wss } = express;

app.use(cors());
app.use(routes);

const logStats = createStatsLogger();
wss.on('connection', (client) => {
  logStats(wss, 'A client has connected!');
  client.on('close', () => {
    logStats(wss, 'A client has disconnected!');
  });
});

const port = config.get('port');
app.listen(port, () => {
  log(`📡 Server is listening on port ${port}.`);
});
