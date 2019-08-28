import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {WelcomeComponent} from './welcome.component';

@NgModule({
  imports: [CommonModule, UIRouterModule],
  providers: [],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
