/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';

import upload from './lib/upload';

const server = express();

server.use(cors());

server.post('/upload', (request, response) => {
  upload(request, response, (error) => {
    if (error) {
      console.log(error);
    }
    console.log('File uploaded successfully.');
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001.');
});
