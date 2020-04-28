import AWS from 'aws-sdk';
import * as stream from 'stream';
import * as AWSRequest from 'aws-sdk/lib/request';

import config from '../config';

interface FileUploadArgs {
  key: string;
  body: stream.Readable;
  length?: number;
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
  const { key, body, length } = file;
  const managedUpload = s3.upload({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentLength: length,
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
