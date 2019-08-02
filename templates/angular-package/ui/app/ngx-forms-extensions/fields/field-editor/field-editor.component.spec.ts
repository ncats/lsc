import {ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxFormModule} from '@labshare/ngx-forms';
import {FieldEditorComponent} from './field-editor.component';
import {By} from '@angular/platform-browser';
import {FieldEditorAccessorComponent} from './value-accessor/field-editor-accessor.component';

describe('FieldEditorComponent', () => {
  let component: FieldEditorComponent;
  let fixture: ComponentFixture<FieldEditorComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  const model = [
    {type: 'a', name: 'a', label: 'a'},
    {type: 'b', name: 'b', label: 'b'},
    {type: 'a', name: 'c', label: 'b'},
    {type: 'b', name: 'd', label: 'd'},
    {type: 'a', name: 'e', label: 'e'}
  ];
  const field = {type: 'crada', name: 'crada', label: 'Type Of Field', options: ['a', 'b'], required: true};

  const data = {crada: model};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxFormModule, ReactiveFormsModule, FormsModule],
      declarations: [FieldEditorComponent, FieldEditorAccessorComponent],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldEditorComponent);
    component = fixture.componentInstance;
    const control = formBuilder.control([]);
    component.field = field;
    component.group = formBuilder.group({});
    component.group.addControl('crada', control);
    component.group.setValue(data);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('HTML', () => {
    it('ensures total number of inputs is correct', () => {
      const el = fixture.debugElement.queryAll(By.css('input'));
      expect(el.length).toEqual(model.length * 2);
    });
  });
});
