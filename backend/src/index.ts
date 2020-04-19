/* eslint-disable no-console */
import cors from 'cors';

/**
 * Set up Express and WebSocket server before loading and defining routes
 * https://github.com/HenningM/express-ws#usage
 */
import express from './wexpress';

import routes from './routes';
import config from './config';

const { app, wss } = express;

app.use(cors());

wss.on('connection', () => {
  console.log('client connected');
});
app.use(routes);

const port = config.get('port');
app.listen(port, () => {
  console.log(`📡 Server is listening on port ${port}.`);
});
