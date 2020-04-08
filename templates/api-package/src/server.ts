import {<%= appNamePascalCase %>Application} from './application';
import {ApplicationConfig} from '@loopback/core';
import express from 'express';
import pEvent from 'p-event';
import * as http from 'http';

export class ExpressServer {
  private app: express.Application;
  public readonly api: <%= appNamePascalCase %>Application;
  private server: http.Server;

  constructor(private options: ApplicationConfig = {}) {
    this.app = express();
    this.api = new <%= appNamePascalCase %>Application(options);

    // Expose the front-end assets via Express, not as LB4 route
    this.app.use(this.options.<%= appNamePascalCase %>.basePath, this.api.requestHandler);

    // Serve static files in the public folder
    this.app.use(express.static('public'));
  }

  public async boot() {
    await this.api.boot();
  }

  public async start() {
    await this.api.start();
    this.server = this.app.listen(
      this.options.rest.port,
      this.options.rest.host,
    );

    await pEvent(this.server, 'listening');
  }

  public async stop() {
    if (!this.server) return;
    this.server.close();
    await pEvent(this.server, 'close');
  }
}
