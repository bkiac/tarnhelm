import AWS from 'aws-sdk';
import * as stream from 'stream';
import * as AWSRequest from 'aws-sdk/lib/request';

import config from '../../config';

const { accessKey, endpoint, bucket } = config.get('s3');
const s3 = new AWS.S3({
  accessKeyId: accessKey.id,
  secretAccessKey: accessKey.secret,
  endpoint,
});

export interface S3UploadArgs {
  key: string;
  body: stream.Readable;
  length?: number;
}
export type S3UploadListener = (progress: AWS.S3.ManagedUpload.Progress) => void;
export async function set(
  data: S3UploadArgs,
  listener?: (progress: AWS.S3.ManagedUpload.Progress) => void,
): Promise<AWS.S3.ManagedUpload.SendData> {
  const { key, body, length } = data;
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

export async function delMany(
  keys: string[],
): Promise<AWSRequest.PromiseResult<AWS.S3.Types.DeleteObjectsOutput, AWS.AWSError>> {
  return s3
    .deleteObjects({
      Bucket: bucket,
      Delete: { Objects: keys.map((key) => ({ Key: key })) },
    })
    .promise();
}

export async function list(options?: {
  maxKeys?: number;
  continuationToken?: string;
}): Promise<AWSRequest.PromiseResult<AWS.S3.Types.ListObjectsV2Output, AWS.AWSError>> {
  const params = {
    Bucket: bucket,
    ...(options && { MaxKeys: options.maxKeys, ContinuationToken: options.continuationToken }),
  };
  return s3.listObjectsV2(params).promise();
}
