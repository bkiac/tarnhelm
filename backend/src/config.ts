/* eslint-disable no-console */
import convict from 'convict';
import { isString } from 'lodash';

convict.addFormat({
  name: 'string',
  validate: (value) => {
    if (!isString(value) || value === '') {
      throw new Error(`must be a non-empty string, got ${value}`);
    }
  },
});

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },

  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 7089,
    env: 'PORT',
  },

  storage: {
    endpoint: {
      doc: 'The S3 endpoint.',
      format: 'url',
      default: '',
      env: 'STORAGE_ENDPOINT',
    },
    bucket: {
      doc: 'The S3 bucket.',
      format: 'string',
      default: '',
      env: 'STORAGE_BUCKET',
    },
    accessKey: {
      id: {
        doc: 'The S3 access key ID.',
        format: 'string',
        default: '',
        sensitive: true,
        env: 'STORAGE_ACCESS_KEY_ID',
      },
      secret: {
        doc: 'The S3 access key secret.',
        format: 'string',
        default: '',
        sensitive: true,
        env: 'STORAGE_ACCESS_KEY_SECRET',
      },
    },
  },
});

console.log('⚙️ Config has been loaded:', config.toString());
config.validate({ allowed: 'strict' });

export default config;
