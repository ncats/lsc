// Example Angular component

'use strict';

import {Component} from '@angular/core'

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    providers: []
})
export class HomeComponent {

    public message = '<%= appNameSlug %>\'s home page';

    constructor() {
    }

    ngOnInit() {
    }
}