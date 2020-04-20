import AWS from 'aws-sdk';
import * as stream from 'stream';
import { v4 as uuid } from 'uuid';

import config from '../config';

const { accessKey, endpoint, bucket } = config.get('storage');

const s3 = new AWS.S3({
  accessKeyId: accessKey.id,
  secretAccessKey: accessKey.secret,
  endpoint,
});

interface FileUploadArgs {
  name: string;
  stream: stream.Readable;
}
export default (file: FileUploadArgs): Promise<AWS.S3.ManagedUpload.SendData> => {
  return s3
    .upload({
      Bucket: bucket,
      Key: `${uuid()}:${file.name}`,
      Body: file.stream,
    })
    .promise();
};
