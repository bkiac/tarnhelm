/* eslint-disable no-console */
import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

import config from './config';

const { app } = expressWs(express().use(cors()));

const port = config.get('port');
app.listen(port, () => {
  console.log(`📡 Server is listening on port ${port}.`);
});
