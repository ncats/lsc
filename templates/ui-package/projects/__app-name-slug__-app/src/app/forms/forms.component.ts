import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFormOptions, FormlyFieldConfig} from '@ngx-formly/core';
import {FormsService} from './forms.service';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  sourceCode = `
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = {};
  fields: FormlyFieldConfig[];
  data;

  constructor(private formsService: FormsService) {}
  submit() {
    if (this.form.valid) {
      this.data = {...this.model};
    }
  }
  ngOnInit() {
    this.formsService.getFields().subscribe(fields => (this.fields = fields));
  }
  `;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = {};
  fields: FormlyFieldConfig[];
  data;

  constructor(private formsService: FormsService) {}
  submit() {
    if (this.form.valid) {
      this.data = {...this.model};
    }
  }
  ngOnInit() {
    this.formsService.getFields().subscribe(fields => (this.fields = fields));
  }
}
