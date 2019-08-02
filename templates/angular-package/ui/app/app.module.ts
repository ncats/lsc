import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {ThemeModule} from './theme/theme.module';
import {ShellModule} from './shell/shell.module';
import '../assets/styles.scss';
import '../favicon.ico';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Export Angular 6 feature module
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
