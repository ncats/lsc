import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {VersionComponent} from './version/version.component';

export const routes: Routes = [
  {
    path: '',
    component: VersionComponent,
    outlet: 'center'
  }
];
