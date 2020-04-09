import {Request, RestBindings, post, get} from '@loopback/rest';
import {inject} from '@loopback/context';
import {CacheBindings, LabShareCache} from '@labshare/services-cache';
import {
  NotificationsBindings,
  LabShareNotifications,
  NotificationType,
} from '@labshare/services-notifications';
import {LogBindings, LabShareLogger} from '@labshare/services-logger';
import {<%= appNamePascalCase %>ApiBindings} from '../keys';
import {ApplicationConfig} from '@loopback/core';
import {authenticate} from '@labshare/services-auth';

/**
 * A simple controller to bounce back http requests
 */
export class ServicesController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(CacheBindings.CACHE) private cache: LabShareCache,
    @inject(LogBindings.LOGGER) private log: LabShareLogger,
    @inject(NotificationsBindings.NOTIFICATIONS)
    private notifications: LabShareNotifications,
    @inject(<%= appNamePascalCase %>ApiBindings.CONFIG) public config: ApplicationConfig,
  ) {}

  // Map to `POST /notifications`
  @post('/notifications', {
    responses: {
      '200': {
        description: `Notification sent.`,
      },
    },
  })
  sendNotifications(): object {
    return this.notifications.send(NotificationType.EMAIL, {
      to: this.config.<%= appNameCamelCase %>?.email?.to,
      subject: 'send test email',
      text: 'test',
    });
  }
  // Map to `POST /cache`
  @post('/cache', {
    responses: {
      '200': {
        description: `Object cached`,
      },
    },
  })
  async saveCache() {
    const cachedObject = await this.cache.getItem('TEST');
    if (!cachedObject) {
      await this.cache.setItem(
        'TEST',
        {value: 'from cache'},
        {isCachedForever: true},
      );
      return {value: `Cache added, try again`};
    }
    return cachedObject;
  }
  // Map to `POST /notifications`
  @post('/log', {
    responses: {
      '200': {
        description: `Log created, check the api's output.`,
      },
    },
  })
  sendLogs(): void {
    this.log.info('logging from tests');
  }

  // Map to `GET /authenticated`
  @authenticate()
  @get('/authenticated', {
    responses: {
      '200': {
        description: `Test an protected route.`,
        schema: {
          type: 'string',
        },
      },
    },
  })
  async authenticated(): Promise<string> {
    return `authenticated route`;
  }
}
