// Example Angular component

'use strict';

import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {ConfigService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public message = `<%= appTitle %>'s home page`;

  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.message = `<%= appTitle %>'s home page with ` + this.config.get('test-config');
  }
}
