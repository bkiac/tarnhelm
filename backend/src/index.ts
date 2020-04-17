/* eslint-disable no-console */
import express from 'express';
import http from 'http';
import cors from 'cors';

import config from './config';
import bindSocket from './socket';

const app = express(); // Create Express app

app.use(cors());

const server = new http.Server(app); // Create HTTP server from Express app
bindSocket(server);
const port = config.get('port');
server.listen(port, () => {
  console.log(`📡 Server is listening on port ${port}.`);
});
