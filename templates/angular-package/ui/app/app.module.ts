import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {
  AuthService,
  AuthInterceptor,
  OidcNavigationService,
  NgxCoreServicesModule,
  Config,
} from '@labshare/ngx-core-services';
import {UIRouterService} from './shared/ui-router.services';
import {routes} from './app.routes';
import {HomeComponent} from './home/home.component';
import {AppComponent} from './app.component';

// app initializer for Auth
export function initializeAuth(auth: AuthService): () => Promise<any> {
  return async () => {
    return auth.configure().toPromise();
  };
}

// Export Angular 4 feature module
@NgModule({
  declarations: [AppComponent, HomeComponent],
  entryComponents: [],
  exports: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    NgxCoreServicesModule.forRoot(APP_CONF),
    UIRouterModule.forRoot(routes),
  ],
  providers: [
    // App initializer
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
    // Enable the interceptors
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    // Enable UIRouting Navigation for Auth Service
    {provide: OidcNavigationService, useClass: UIRouterService},
  ],
  bootstrap: [AppComponent],
})

export class <%= appTitle %>Module {}
