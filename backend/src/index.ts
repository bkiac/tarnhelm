/* eslint-disable no-console */
import AWS from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import cors from 'cors';

const server = express();

const {
  env: { FILES_ENDPOINT, FILES_BUCKET, FILES_ACCESS_KEY_ID, FILES_SECRET_ACCESS_KEY },
} = process;

const s3 = new AWS.S3({
  accessKeyId: FILES_ACCESS_KEY_ID,
  secretAccessKey: FILES_SECRET_ACCESS_KEY,
  endpoint: FILES_ENDPOINT,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: FILES_BUCKET || '',
    key(request, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
}).array('upload', 1);

server.use(cors());

server.post('/upload', (request, response) => {
  upload(request, response, (error) => {
    if (error) {
      console.log(error);
      return response.redirect('/error');
    }
    console.log('File uploaded successfully.');
    return response.redirect('/success');
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001.');
});
