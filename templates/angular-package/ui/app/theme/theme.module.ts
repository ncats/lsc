import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeComponent} from './theme.component';
import {TopNavModule} from '@labshare/stateful-components';
import {LeftNavModule} from '@labshare/stateful-components';
import {RouterModule} from '@angular/router';
@NgModule({
  imports: [CommonModule, TopNavModule, LeftNavModule, RouterModule],
  providers: [],
  declarations: [ThemeComponent],
  exports: [ThemeComponent]
})
export class ThemeModule {}
