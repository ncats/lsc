import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from '../app-routing.module';
@NgModule({
  imports: [CommonModule, AppRoutingModule, FormsModule],
  declarations: [HomeComponent],
  exports: [AppRoutingModule, HomeComponent]
})
export class CoreModule {}
