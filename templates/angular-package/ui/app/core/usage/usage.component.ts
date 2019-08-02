// Example Angular component

'use strict';

import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {UsageService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss']
})
export class UsageComponent implements OnInit {
  public message = `Newapp2's usage page`;
  public isUsageEnable = false;

  constructor(private usage: UsageService) {}

  ngOnInit() {
    this.isUsageEnable = this.usage.hasUrl();
    this.message = `Usage is ` + (this.isUsageEnable === true ? `On` : `Off`);
  }

  onSendUsage() {
    this.usage.send({event: 'test', info: 'sending data'});
  }
}
