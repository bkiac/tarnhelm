import express from 'express';
import expressWs from 'express-ws';

// Augment Express app with a WebSocket server
const { app, getWss } = expressWs(express());

export default {
  app,
  wss: getWss(),
};
