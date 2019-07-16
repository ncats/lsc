import {Component, OnInit} from '@angular/core';
import {AuthService} from '@labshare/ngx-core-services';
@Component({
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.configure().subscribe(done => {
      this.authService.logout();
    });
  }
}
