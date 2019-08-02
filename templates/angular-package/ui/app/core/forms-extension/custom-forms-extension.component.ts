// Example Angular component

'use strict';

import {Component, ViewChild} from '@angular/core';
import {DynamicFormDirective} from '@labshare/ngx-forms';
const formConfig = require('./custom-forms-extension.fields.json');
@Component({
  selector: 'app-custom-forms-extension',
  templateUrl: './custom-forms-extension.component.html',
  styleUrls: ['./custom-forms-extension.component.scss']
})
export class CustomFormsExtensionComponent {
  @ViewChild('form', {static: true}) public formReference: DynamicFormDirective;

  public config = formConfig;

  constructor() {}

  save() {
    const data = this.formReference.value;
    console.log(data);
  }
}
