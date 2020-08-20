import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VersionComponent} from './version/version.component';
import {RouterModule} from '@angular/router';
import {routes} from './routing';
@NgModule({
  declarations: [VersionComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ShellModule {}
