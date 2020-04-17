import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

import config from '../config';

const { accessKey, endpoint, bucket } = config.get('storage');

const s3 = new AWS.S3({
  accessKeyId: accessKey.id,
  secretAccessKey: accessKey.secret,
  endpoint,
});

export default multer({
  storage: multerS3({
    s3,
    bucket,
    key(request, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).array('upload', 1);
