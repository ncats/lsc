import { TestBed } from '@angular/core/testing';

import { <%= appNamePascalCase %>Service } from './<%= appNameSlug %>.service';

describe('<%= appNamePascalCase %>Service', () => {
  let service: <%= appNamePascalCase %>Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= appNamePascalCase %>Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
