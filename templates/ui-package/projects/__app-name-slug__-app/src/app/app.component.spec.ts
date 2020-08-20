import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AuthService, NgxCoreServicesModule} from '@labshare/ngx-core-services';
import {of} from 'rxjs';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            configure() {
              return of();
            },
            isAuthenticated() {
              return true;
            },
            getProfile() {
              return of({});
            },
            onAuthorizationResult() {
              return of('authorized');
            }
          }
        }
      ],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
