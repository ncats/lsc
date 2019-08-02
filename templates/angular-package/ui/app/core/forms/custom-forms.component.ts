// Example Angular component

'use strict';

import {Component, ViewChild} from '@angular/core';
import {DynamicFormDirective} from '@labshare/ngx-forms';

@Component({
  selector: 'app-custom-forms',
  templateUrl: './custom-forms.component.html',
  styleUrls: ['./custom-forms.component.scss']
})
export class CustomFormsComponent {
  @ViewChild('form', {static: true}) public formReference: DynamicFormDirective;

  public config = {
    layout: 'basic',
    fields: [
      {type: 'text', label: 'Title', name: 'title'},
      {type: 'text', label: 'Name', name: 'name'},
      {type: 'text', label: 'Age', name: 'age'}
    ]
  };
  public data = {};
  public message = `Newapp2's form page`;

  constructor() {}
}
