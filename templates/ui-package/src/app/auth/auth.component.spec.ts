import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthComponent} from './auth.component';
import {AuthService} from '@labshare/ngx-core-services';
import {of} from 'rxjs';
describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AuthComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated() {
              return true;
            },
            getProfile() {
              return of({});
            },
            onAuthorizationResult() {
              return of('authorized');
            },
            isAuthorized() {
              return of(true);
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
