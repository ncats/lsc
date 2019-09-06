// Example Angular component

'use strict';

import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {LoggingService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss']
})
export class UsageComponent implements OnInit {
  public message = `Newapp2's usage page`;
  public isUsageEnable = false;

  constructor(private loggingService: LoggingService) {}

  ngOnInit() {
    this.isUsageEnable = this.loggingService.hasUrl();
    this.message = `Usage is ` + (this.isUsageEnable === true ? `On` : `Off`);
  }

  onSendUsage() {
    this.loggingService.info({event: 'test', message: 'sending data'});
  }
}
