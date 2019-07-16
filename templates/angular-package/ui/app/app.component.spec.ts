import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {ThemeModule} from './theme/theme.module';
import {AuthService} from '@labshare/ngx-core-services';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './core/home/home.component';
import {APP_BASE_HREF} from '@angular/common';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ThemeModule, AppRoutingModule],
      declarations: [AppComponent, HomeComponent],
      providers: [AuthService, {provide: APP_BASE_HREF, useValue: '/'}]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title '<%= appNameSlug %>'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('<%= appNameSlug %>');
  });
});
