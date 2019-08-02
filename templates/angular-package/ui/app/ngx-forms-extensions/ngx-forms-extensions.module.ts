import {NgxFormModule} from '@labshare/ngx-forms';
import {NgModule} from '@angular/core';
import {formsLayouts} from './custom-layout/layouts';
import {CustomFields, CustomFieldsComponents} from './fields';
import {FieldEditorAccessorComponent} from './fields/field-editor/value-accessor/field-editor-accessor.component';
import {CustomLayoutComponent} from './custom-layout/custom-layout.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxFormModule.forRoot({
      layoutDictionary: formsLayouts,
      fieldDictionary: CustomFields
    })
  ],
  declarations: [CustomFieldsComponents, FieldEditorAccessorComponent],
  entryComponents: [CustomLayoutComponent, CustomFieldsComponents]
})
export class NgxFormsExtensionsModule {}
