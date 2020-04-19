/* eslint-disable no-console */
export function log(message: string, meta?: any): void {
  console.log(new Date(), message, meta);
}
