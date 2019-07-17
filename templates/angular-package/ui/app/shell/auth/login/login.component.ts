import {Component, OnInit} from '@angular/core';
import {AuthService} from '@labshare/ngx-core-services';
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.configure().subscribe(done => {
      this.authService.login();
    });
  }
}
