import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UsersRouting} from './app-routing.module';
import {NgxBaseComponentsModule} from '@labshare/ngx-base-components';
import {CenterHeaderComponent} from './center-header/center-header.component';
import {AppComponent} from './app.component';
import {LabShareComponent} from './labshare/labshare.component';
import {labshare} from './theme/theme';
import {CommonModule} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {FormsComponent} from './forms/forms.component';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {
  NgxCoreServicesModule,
  AuthService,
  ConfigService,
  initializeFromAppConf,
  AppType,
  EventService
} from '@labshare/ngx-core-services';
// this editor should be removed for a real project
import {LoggingComponent} from './logging/logging.component';
import {AuthComponent} from './auth/auth.component';
import {Router} from '@angular/router';

const customThemes = [labshare];
// Export Angular 8 feature module
// app initializer for Auth
// app initializer
function initialize(http: HttpClient, config: ConfigService, auth: AuthService): () => Promise<any> {
  return async () => {
    if (APP_TYPE === AppType.Site) {
      return initializeFromAppConf(http, config, auth);
    } else {
      return auth.configure().toPromise();
    }
  };
}
@NgModule({
  declarations: [
    CenterHeaderComponent,
    LabShareComponent,
    AppComponent,
    FormsComponent,
    LoggingComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    NgxCoreServicesModule.forRoot({appConf: APP_CONF, appType: APP_TYPE, appBuildVersion: APP_BUILD_VERSION}),
    NgxBaseComponentsModule.forRoot(customThemes),
    CommonModule,
    UsersRouting,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    NgxJsonViewerModule,
    FormlyBootstrapModule
  ],
  providers: [
    Title,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [HttpClient, ConfigService, AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authService: AuthService, private router: Router, private eventService: EventService) {
    this.authService.onAuthCallback();
  }
}
