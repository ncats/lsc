import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
@Injectable()
export class NgRoutingService {
  constructor(private router: Router) {}
  navigate(url: string) {
    this.router.navigate([url]);
  }
}
