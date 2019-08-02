import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FieldConfig, Field} from '@labshare/ngx-forms';

@Component({
  selector: 'field-editor',
  templateUrl: './field-editor.component.html'
})
export class FieldEditorComponent implements Field {
  public field: FieldConfig;
  public group: FormGroup;
}
