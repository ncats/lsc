import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
@Injectable()
export class NgRoutingService {
  constructor(private injector: Injector) {}
  navigate(state: string) {
    const router = this.injector.get(Router);
    router.navigate([state]);
  }
}
