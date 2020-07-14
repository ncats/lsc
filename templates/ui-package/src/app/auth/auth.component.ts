import {Component, OnInit} from '@angular/core';
import {AuthService} from '@labshare/ngx-core-services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  onAuthorizationResult;
  isLoggingEnable = false;
  configurationCode = `
  module.exports = {
    services: {
      auth: {
        authFlowType: 'code',
        url: process.env.SERVICES_AUTH_URL,
        clientId: process.env.SERVICES_AUTH_CLIENT_ID,
        tenant: process.env.SERVICES_AUTH_TENANT
      },
    }
  };
  `;
  sourceCode = `
  constructor(private authService: AuthService, ) {
  }

  ngOnInit() {
    // Observable to determine if is authorized or not, default value is undefined
    this.authService.isAuthorized().subscribe(authorized => {
      if(authorized || authorized === false) {
        this.isLoggingEnable = authorized;
        console.log('is authorized: ' + authorized);
      }
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
  public onAuthorizationResult;
  constructor(private authService: AuthService, private router: Router, private eventService: EventService) {
    this.onAuthorizationResult = this.authService.onAuthorizationResult();
  }

  ngOnInit(): void {
    //process the callback after authorization with auth system
    this.authService.onAuthCallback();

    // Observable for receiving the auth's events
    this.onAuthorizationResult.subscribe(result => {
      if (result.authorizationState === 'authorized') {
        console.log('authorized');
      }
    });
  }

  `;
  constructor(private authService: AuthService) {
    this.onAuthorizationResult = this.authService.onAuthorizationResult();
  }

  ngOnInit() {
    // Observable to determine if is authorized or not, default value is undefined
    this.authService.isAuthorized().subscribe(authorized => {
      if(authorized !== undefined) {
        this.isLoggingEnable = authorized;
        console.log('is authorized: ' + authorized);
      }
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
