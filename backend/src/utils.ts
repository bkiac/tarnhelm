/* eslint-disable no-console */
import { Server } from 'ws';
import { memoize } from 'lodash';

export const ONE_DAY_IN_SECONDS = 86400;

export function log(message: string, meta?: any): void {
  console.log(new Date(), message, meta);
}

export const createStatsLogger = memoize(() => {
  let max = 0;
  return (wss: Server, message: string) => {
    const {
      clients: { size: current },
    } = wss;
    max = current > max ? current : max;
    log(message, { current, max });
  };
});
