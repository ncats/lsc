// Example Angular component

'use strict';

import {Component} from '@angular/core';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  template: require('./home.component.html'),
  styles: [require('./home.component.css').toString()],
})
export class HomeComponent implements OnInit {

    public message = '<%= appNameSlug %>\'s home page';

  constructor() {}

  ngOnInit() {}
}
