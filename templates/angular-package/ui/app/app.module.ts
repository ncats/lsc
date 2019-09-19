import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {ThemeModule} from './theme/theme.module';
import {ShellModule} from './shell/shell.module';
import '../assets/styles.scss';
import '../favicon.ico';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '@labshare/ngx-core-services';

// app initializer for Auth
function initializeAuth(auth: AuthService): () => Promise<any> {
  return async () => {
    return auth.configure().toPromise();
  };
}

// Export Angular 8 feature module
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  exports: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    ShellModule,
    CoreModule,
    ThemeModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
