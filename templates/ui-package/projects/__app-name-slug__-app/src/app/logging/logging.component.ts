import {Component, OnInit} from '@angular/core';
import {LoggingService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {
  isLoggingEnable = false;
  configurationCode = `
  module.exports = {
    services: {
      logging: {
        url: process.env.SERVICES_LOG_URL,
        application: process.env.SERVICES_LOG_APP,
        environment: process.env.SERVICES_LOG_ENV,
        subTag: process.env.SERVICES_LOG_TAG,
      },
    }
  };
  `;
  sourceCode = `
  // adding the logging service
  constructor(private loggingService: LoggingService) {}
  onSendInfoUsage() {
    // sending the event's test as info
    this.loggingService.info({event: 'test', message: 'sending data'});
  }
  `;
  constructor(private loggingService: LoggingService) {}

  ngOnInit() {
    this.isLoggingEnable = this.loggingService.hasUrl();
    if (!this.isLoggingEnable) {
    }
  }

  onSendInfoUsage() {
    if (this.isLoggingEnable) {
      this.loggingService.info({event: 'test', message: 'sending data'});
    }
  }
  onSendErrorUsage() {
    if (this.isLoggingEnable) {
      this.loggingService.error({event: 'test', message: 'sending data'});
    }
  }
}
