import AWS from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

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
    key: function(request, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
}).array('upload', 1);

server.use(express.static('public'));

server.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

server.get('/success', function(request, response) {
  response.sendFile(__dirname + '/public/success.html');
});

server.get('/error', function(request, response) {
  response.sendFile(__dirname + '/public/error.html');
});

server.post('/upload', function(request, response, next) {
  upload(request, response, function(error) {
    if (error) {
      console.log(error);
      return response.redirect('/error');
    }
    console.log('File uploaded successfully.');
    response.redirect('/success');
  });
});

server.listen(3001, function() {
  console.log('Server listening on port 3001.');
});
