import {NgModule, APP_INITIALIZER} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LogoutComponent} from './auth/logout/logout.component';
import {LoginComponent} from './auth/login/login.component';
import {VersionComponent} from './version/version.component';
import {ShellRoutingModule} from './shell-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgRoutingService} from './services';
import {AuthInterceptor, OidcNavigationService, NgxCoreServicesModule} from '@labshare/ngx-core-services';

@NgModule({
  imports: [CommonModule, NgxCoreServicesModule.forRoot(APP_CONF), ShellRoutingModule, FormsModule],
  declarations: [LogoutComponent, LoginComponent, VersionComponent],
  providers: [
    // Enable the interceptors
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    // Enable UIRouting Navigation for Auth Service
    {provide: OidcNavigationService, useClass: NgRoutingService}
  ]
})
export class ShellModule {}
