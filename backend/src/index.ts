/* eslint-disable no-console */
import express from 'express';
import http from 'http';
import cors from 'cors';

import bindSocket from './socket';

const app = express(); // Create Express app

app.use(cors());

const server = new http.Server(app); // Create HTTP server from Express app
bindSocket(server);
server.listen(3001, () => {
  console.log('Server listening on port 3001.');
});
