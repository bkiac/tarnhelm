import io from 'socket.io';
import { v4 as uuid } from 'uuid';
import { Dictionary } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import http from 'http';

import {
  WebSocketEventHandler,
  WebSocketEventListener,
  WebSocketEvent,
  WebSocketIncomingData,
} from './types';
import { log } from './utils';

class TarnhelmWebSocket {
  private server: io.Server;
  private clients: Partial<Dictionary<io.Socket>> = {};
  private stats = {
    current: 0,
    max: 0,
  };

  constructor(httpServer: http.Server) {
    this.server = io(httpServer);
    this.server.on('connection', this.handleConnection);
  }

  /** Getters, Setters */

  public getServer(): io.Server {
    return this.server;
  }

  private getClient(id: string): io.Socket {
    const client = this.clients[id];
    if (client) {
      return client;
    }
    throw new Error(`No client found for ID ${id}`);
  }

  private setClient(id: string, client?: io.Socket): void {
    this.clients[id] = client;
  }

  private removeClient(id: string): void {
    this.setClient(id, undefined);
  }

  /** Handlers */

  private handleConnection = (client: io.Socket): io.Socket => {
    const id = uuid();
    this.setClient(id, client);
    this.updateStats();
    log('Client connected', {
      id,
      stats: this.stats,
    });
    return this.attachHandlers(id, [
      ['disconnect', this.handleDisconnect],
      ['upload', this.handleUpload],
    ]);
  };

  private handleUpload: WebSocketEventHandler<ArrayBuffer> = (file) => {
    const buffer = Buffer.from(file);
    log('File received');
    fs.createWriteStream(path.join(__dirname, 'file'), { flags: 'a' }).write(buffer);
  };

  private handleDisconnect: WebSocketEventHandler<undefined> = (_, { id }) => {
    this.removeClient(id);
    this.updateStats();
    log('Client disconnected', { id, stats: this.stats });
  };

  /** Utils */

  private createListener = <T extends WebSocketIncomingData>(
    id: string,
    handler: WebSocketEventHandler<T>,
  ): WebSocketEventListener<T> => {
    return (data) => {
      const client = this.getClient(id);
      handler(data, { id, client });
    };
  };

  private attachHandlers = (
    clientId: string,
    specs: [WebSocketEvent, WebSocketEventHandler<any>][],
  ): io.Socket => {
    const client = this.getClient(clientId);
    specs.forEach(([event, handler]) => {
      client.on(event, this.createListener(clientId, handler));
    });
    return client;
  };

  private updateStats = (): void => {
    const current = Object.values(this.clients).reduce(
      (sum, client) => (client ? sum + 1 : sum),
      0,
    );
    const { max } = this.stats;
    this.stats = {
      current,
      max: current > max ? current : max,
    };
  };
}

export default function bind(httpServer: http.Server): TarnhelmWebSocket {
  return new TarnhelmWebSocket(httpServer);
}
