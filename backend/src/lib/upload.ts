import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const {
  env: { FILES_ENDPOINT, FILES_BUCKET, FILES_ACCESS_KEY_ID, FILES_SECRET_ACCESS_KEY },
} = process;

const s3 = new AWS.S3({
  accessKeyId: FILES_ACCESS_KEY_ID,
  secretAccessKey: FILES_SECRET_ACCESS_KEY,
  endpoint: FILES_ENDPOINT,
});

export default multer({
  storage: multerS3({
    s3,
    bucket: FILES_BUCKET || '',
    key(request, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).array('upload', 1);
