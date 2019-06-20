// UIRouter services for supporting ui router
import {Injectable, Optional, Injector} from '@angular/core';
import {UIRouter} from '@uirouter/angular';
import * as _ from 'lodash';
@Injectable()
export class UIRouterService {
  constructor(private router: UIRouter) {}
  navigate(url: string) {
    if (!_.isEmpty(url)) {
      this.router.stateService.go(url);
    }
  }
}