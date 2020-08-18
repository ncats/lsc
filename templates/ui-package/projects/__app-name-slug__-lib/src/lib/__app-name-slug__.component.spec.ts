import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { <%= appNamePascalCase %>Component } from './<%= appNameSlug %>.component';

describe('<%= appNamePascalCase %>Component', () => {
  let component: <%= appNamePascalCase %>Component;
  let fixture: ComponentFixture<<%= appNamePascalCase %>Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= appNamePascalCase %>Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= appNamePascalCase %>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
