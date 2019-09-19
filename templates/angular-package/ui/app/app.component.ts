import {Component, OnInit} from '@angular/core';
import {AuthService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  title = '<%= appNameSlug %>';
  ngOnInit(): void {
    this.authService.onAuthCallback();
  }
}
