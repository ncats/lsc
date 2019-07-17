// Example Angular component

'use strict';

import {Component} from '@angular/core';
import {OnInit} from '@angular/core';

@Component({
  selector: 'shell-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  public message = PROJECT_BUILD_VERSION;

  constructor() {}

  ngOnInit() {}
}
