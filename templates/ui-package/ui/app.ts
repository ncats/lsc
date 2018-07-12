// The main feature module of <%= appNameSlug %>
'use strict';

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {HttpClientModule} from '@angular/common/http';
import {states} from './home/states';
import {HomeComponent} from './home/home.component';

// Export Angular 4 feature module
@NgModule({
    declarations: [
        HomeComponent
    ],
    entryComponents: [],
    exports: [],
    imports: [
        HttpClientModule,
        CommonModule,
        UIRouterModule.forChild({
            states
        })
    ],
    providers: []
})

export class <%= appTitle %>Module {
}
