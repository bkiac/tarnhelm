export { encryptStream, decryptStream } from './ece';
export * from './utils';

export const getRandomValues: typeof crypto.getRandomValues = (array) =>
  crypto.getRandomValues(array);
