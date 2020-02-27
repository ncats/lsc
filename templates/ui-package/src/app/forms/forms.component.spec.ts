import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormsComponent} from './forms.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';

describe('FormsComponent', () => {
  let component: FormsComponent;
  let fixture: ComponentFixture<FormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormsComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        NgxJsonViewerModule,
        FormlyBootstrapModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
