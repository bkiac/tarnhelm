/* eslint-disable no-console */
import convict from 'convict';

import addCustomFormats from './formats';

addCustomFormats();

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },

  port: {
    doc: 'The port to bind.',
    format: 'websocket-port',
    default: 7089,
    env: 'PORT',
  },

  redis: {
    url: {
      doc: 'The Redis server URL.',
      format: 'string',
      default: '',
      env: 'REDIS_URL',
    },
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
