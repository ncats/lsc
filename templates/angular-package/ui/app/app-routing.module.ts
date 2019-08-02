import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './core/home/home.component';
import {CustomFormsComponent} from './core/forms/custom-forms.component';
import {UsageComponent} from './core/usage/usage.component';
import {CustomFormsExtensionComponent} from './core/forms-extension/custom-forms-extension.component';
const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'usage', component: UsageComponent},
  {path: 'custom-forms', component: CustomFormsComponent},
  {path: 'custom-forms-extension', component: CustomFormsExtensionComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
