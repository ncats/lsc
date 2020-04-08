import {LogBindings, ServicesLoggerComponent} from '@labshare/services-logger';
import {
  AuthenticationBindings,
  ServicesAuthComponent,
} from '@labshare/services-auth';
import {CacheBindings, ServicesCacheComponent} from '@labshare/services-cache';
import {
  NotificationsBindings,
  ServicesNotificationsComponent,
} from '@labshare/services-notifications';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';

import {LabShareSequence} from './sequence';
import {<%= appNamePascalCase %>ApiBindings} from './keys';
export class <%= appNamePascalCase %>Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(LabShareSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.setUpBindings(this.options);

    this.setUpComponents();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpComponents(): void {
    // Binding the services-logger component
    this.component(ServicesLoggerComponent);
    // Binding the services-cache component
    this.component(ServicesCacheComponent);
    // Binding the services-notifications component
    this.component(ServicesNotificationsComponent);

    this.component(ServicesAuthComponent);
  }

  setUpBindings(options: ApplicationConfig): void {
    this.bind(<%= appNamePascalCase %>ApiBindings.CONFIG).to(options);
    this.bind(LogBindings.LOG_CONFIG).to(options?.services?.log);
    this.bind(CacheBindings.CACHE_CONFIG).to(options?.services?.cache);
    this.bind(NotificationsBindings.NOTIFICATIONS_CONFIG).to(
      options?.services?.notifications,
    );
    this.bind(AuthenticationBindings.AUTH_CONFIG).to(options?.services?.auth);
  }
}
