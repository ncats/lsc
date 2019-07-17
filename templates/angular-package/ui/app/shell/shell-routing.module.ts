import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LogoutComponent} from './auth/logout/logout.component';
import {LoginComponent} from './auth/login/login.component';
import {VersionComponent} from './version/version.component';

const shellRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'version', component: VersionComponent}
];
@NgModule({
  imports: [RouterModule.forChild(shellRoutes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
