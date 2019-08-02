import {Component, Input, OnDestroy} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  FormControl,
  FormGroup,
  FormArray
} from '@angular/forms';
import {Subscription} from 'rxjs';

export interface FieldDefinition {
  name: string;
  label: string;
  type: string;
}

export interface LoopbackField {
  label?: string;
  type: string;
}

interface StringToFieldMap {
  [email: string]: LoopbackField;
}

@Component({
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: FieldEditorAccessorComponent
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: FieldEditorAccessorComponent
    }
  ],
  selector: 'field-editor-accessor',
  templateUrl: './field-editor-accessor.component.html'
})
export class FieldEditorAccessorComponent implements ControlValueAccessor, Validator, OnDestroy {
  public localGroup = new FormGroup({fields: new FormArray([])});
  public fields = this.localGroup.controls.fields as FormArray;
  public res: StringToFieldMap = {};
  private subsciption: Subscription;

  @Input() options: string[] = [];

  constructor() {
    this.subsciption = this.fields.valueChanges.subscribe((value: FieldDefinition[]) => {
      setTimeout(() => {
        this.res = {};
        for (const item of value) {
          if (item.name && item.type && item.label) {
            this.res[item.name] = {
              label: item.label,
              type: item.type
            } as LoopbackField;
          }
        }
        this.onModelChange(this.res);
      });
    });
  }

  onModelChange = (model: any) => {};
  onModelTouched = (model: any) => {};

  writeValue(currentValue: any) {
    if (!currentValue) {
      return;
    }

    Object.keys(currentValue).forEach((key: string) => {
      const ob: FieldDefinition = currentValue[key];
      this.fields.push(
        new FormGroup({
          name: new FormControl(key),
          label: new FormControl(ob.label),
          type: new FormControl(ob.type)
        })
      );
    });
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this.localGroup.disable() : this.localGroup.enable();
  }

  validate() {
    const err: {
      required?: boolean;
    } = {};

    let valid = true;

    if (!this.localGroup.valid) {
      err.required = true;
      valid = false;
    }

    return valid ? null : err;
  }

  public add(): void {
    this.fields.push(
      new FormGroup({
        name: new FormControl(''),
        label: new FormControl(''),
        type: new FormControl('')
      })
    );
  }

  public remove(index: number): void {
    this.fields.removeAt(index);
  }

  ngOnDestroy() {
    this.subsciption.unsubscribe();
  }
}
