import AWS from 'aws-sdk';
import * as stream from 'stream';
import { v4 as uuid } from 'uuid';
import * as AWSRequest from 'aws-sdk/lib/request';

import config from '../config';

interface FileUploadArgs {
  name: string;
  stream: stream.Readable;
}

const { accessKey, endpoint, bucket } = config.get('storage');

const s3 = new AWS.S3({
  accessKeyId: accessKey.id,
  secretAccessKey: accessKey.secret,
  endpoint,
});

export function set(
  file: FileUploadArgs,
  listener?: (progress: AWS.S3.ManagedUpload.Progress) => void,
): Promise<AWS.S3.ManagedUpload.SendData> {
  const managedUpload = s3.upload({
    Bucket: bucket,
    Key: `${uuid()}:${file.name}`,
    Body: file.stream,
  });
  if (listener) managedUpload.on('httpUploadProgress', listener);
  return managedUpload.promise();
}

export function get(key: string): stream.Readable {
  return s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
}

export async function del(
  key: string,
): Promise<AWSRequest.PromiseResult<AWS.S3.Types.DeleteObjectOutput, AWS.AWSError>> {
  return s3.deleteObject({ Bucket: bucket, Key: key }).promise();
}
