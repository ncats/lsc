import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxFormModule} from '@labshare/ngx-forms';
import {FieldEditorAccessorComponent} from './field-editor-accessor.component';

describe('FieldEditorAccessorComponent', () => {
  let component: FieldEditorAccessorComponent;
  let fixture: ComponentFixture<FieldEditorAccessorComponent>;
  const model = [
    {type: 'a', name: 'a', partner: 'a'},
    {type: 'b', name: 'b', partner: 'b'},
    {type: 'a', name: 'c', partner: 'b'},
    {type: 'b', name: 'd', partner: 'd'},
    {type: 'a', name: 'e', partner: 'e'}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxFormModule, ReactiveFormsModule, FormsModule],
      declarations: [FieldEditorAccessorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldEditorAccessorComponent);
    component = fixture.componentInstance;
    component.options = ['a', 'b'];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should alphabetize the options', () => {
    expect(component.options[0]).toBe('a');
    expect(component.options[1]).toBe('b');
  });

  it('should not throw error', () => {
    expect(() => {
      component.onModelTouched(123);
    }).not.toThrowError();
  });

  describe('writeValue()', () => {
    it('should set value', () => {
      component.writeValue(model);
      expect(component.fields.value.length).toEqual(model.length);
    });

    it('should not set value', () => {
      component.writeValue(null);
      expect(component.fields.value.length).toEqual(0);
    });
  });

  describe('registerOnChange()', () => {
    it('should register onChange', () => {
      const foo = {log: val => {}};
      spyOn(foo, 'log');
      const x = val => foo.log(val);
      component.registerOnChange(x);
      component.onModelChange(123);
      expect(foo.log).toHaveBeenCalled();
    });
  });

  describe('registerOnTouched()', () => {
    it('should register onTouch', () => {
      const foo = {log: val => {}};
      spyOn(foo, 'log');
      const x = val => foo.log(val);
      component.registerOnTouched(x);
      component.onModelTouched(123);
      expect(foo.log).toHaveBeenCalled();
    });
  });

  describe('setDisabledState()', () => {
    it('should set disalbed', () => {
      component.setDisabledState(true);
      expect(component.localGroup.disabled).toBeTruthy();
    });

    it('should set enabled', () => {
      component.setDisabledState(false);
      expect(component.localGroup.enabled).toBeTruthy();
    });
  });

  describe('validate()', () => {
    it('should return an error object', () => {
      component.localGroup.setErrors({required: true});
      const res = component.validate();
      expect(res.required).toBeTruthy();
    });

    it('should not return an error object', () => {
      const res = component.validate();
      expect(res).toBeFalsy();
    });
  });

  describe('add()', () => {
    it('should add item', () => {
      component.writeValue(model);
      const originalLength = model.length;
      component.add();
      expect(component.fields.value.length).toEqual(originalLength + 1);
    });
  });

  describe('remove()', () => {
    it('should remove first item', () => {
      component.writeValue(model);
      const originalLength = model.length;
      component.remove(0);
      expect(component.fields.value.length).toEqual(originalLength - 1);
    });
  });
});
