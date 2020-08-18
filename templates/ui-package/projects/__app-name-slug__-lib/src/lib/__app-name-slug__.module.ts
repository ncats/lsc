import { NgModule } from '@angular/core';
import { <%= appNamePascalCase %>Component } from './<%= appNameSlug %>.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [<%= appNamePascalCase %>Component],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {path: '', component: <%= appNamePascalCase %>Component},
          {path: '', component: <%= appNamePascalCase %>Component, outlet: 'center'}
        ]
      }
    ])
  ],
  exports: [<%= appNamePascalCase %>Component]
})
export class <%= appNamePascalCase %>Module { }
