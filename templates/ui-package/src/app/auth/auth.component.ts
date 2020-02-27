import {Component, OnInit} from '@angular/core';
import {AuthService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoggingEnable = false;
  configurationCode = `
  module.exports = {
    services: {
      logging: {
        // for apps with no signup page you need to enable
        silentRenew :true,
        // for changing auth flows  - implicit is the default one
        authFlowType : 'code',
        url: process.env.SERVICES_LOG_URL,
        application: process.env.SERVICES_LOG_APP,
        environment: process.env.SERVICES_LOG_ENV,
        subTag: process.env.SERVICES_LOG_TAG,
      },
    }
  };
  `;
  sourceCode = `
  constructor(private authService: AuthService, ) {
  }

  ngOnInit() {
    // Observable for receiving the auth's events, also you can use the default behaviour
    // which is redirect
    this.authService.onAuthorizationResult().subscribe(result => {
      if (result.authorizationState === 'authorized') {
        console.log(\`authorized\`);

      }
    });
    //Observable to determine if is authorized or not
    this.authService.isAuthorized().subscribe(authorized => {
      this.isLoggingEnable =authorized;
      console.log('is authorized: ' + authorized);
    });
  }

  //Method for performing authorization
  public authenticate() {
    this.authService.login();
  }

  //Method for loging out
  public logout() {
    this.authService.logout();
  }


  `;
  appComponentSourceCode = `
  // at App Component
  constructor(private authService: AuthService,
    private router: Router,
    private eventService: EventService) {
    this.authService.configure().subscribe(done => {
      this.authService.onAuthCallback();
    });
  }

  `;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Observable for receiving the auth's events, also you can use the default behaviour
    // which is redirect
    this.authService.onAuthorizationResult().subscribe(result => {
      if (result.authorizationState === 'authorized') {
        console.log(`authorized`);
      }
    });
    // Observable to determine if is authorized or not
    this.authService.isAuthorized().subscribe(authorized => {
      this.isLoggingEnable = authorized;
      console.log('is authorized: ' + authorized);
    });
  }

  // Method for performing authorization
  public authenticate() {
    this.authService.login();
  }

  // Method for loging out
  public logout() {
    this.authService.logout();
  }
}
