import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomFormsComponent} from './forms/custom-forms.component';
import {CustomFormsExtensionComponent} from './forms-extension/custom-forms-extension.component';
import {HomeComponent} from './home/home.component';
import {UsageComponent} from './usage/usage.component';
import {AppRoutingModule} from '../app-routing.module';
import {NgxFormModule} from '@labshare/ngx-forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomLayoutComponent} from '../ngx-forms-extensions/custom-layout/custom-layout.component';
import {NgxFormsExtensionsModule} from '../ngx-forms-extensions/ngx-forms-extensions.module';
@NgModule({
  imports: [CommonModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgxFormModule, NgxFormsExtensionsModule],
  declarations: [
    HomeComponent,
    UsageComponent,
    CustomFormsComponent,
    CustomFormsExtensionComponent,
    CustomLayoutComponent
  ],
  exports: [AppRoutingModule, HomeComponent, UsageComponent, CustomFormsComponent]
})
export class CoreModule {}
