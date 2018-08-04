import {Component, OnInit, isDevMode} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {User, UserService} from '../model/user';
import {AuthenticationService} from '../authentication.service';
import {HttpInterceptorService} from 'ng-http-interceptor';
import {NotificationsService} from 'angular2-notifications';
import {Observable} from 'rxjs';
import {Router, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/catch'

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  authenticatedUser: User;
  currentUser: User;
  loginUrl: String;
  devMode: boolean;

  impersonate: boolean;

  public isCollapsed = true;

  public notifOptions = {
    timeOut: 3000
  };
  private lastUrl: string;

  constructor(private translate: TranslateService, public authenticationService: AuthenticationService,
              private httpInterceptorService: HttpInterceptorService, private notificationsService: NotificationsService,
              public userService: UserService, private router: Router) {
    this.devMode = isDevMode();
    translate.setDefaultLang('fr');

    httpInterceptorService.request().addInterceptor(data => {
      return data;
    });

    httpInterceptorService.response().addInterceptor((res) => {
      return res.catch((err) => {
        if (err.status === 401) {
          this.authenticationService.refreshCurrentUser().subscribe();
          this.notificationsService.error('Authentification Requise', 'Vous devez vous connecter pour accéder à la fonction');
          return Observable.empty();
        } else if (err.status === 400) {
          return Observable.throw(JSON.parse(err._body));
        } else if (err.status === 500) {
          this.notificationsService.error('Erreur interne du serveur', '');
          console.log(err);
          return Observable.empty();
        } else {
          return Observable.throw(err);
        }
      });
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        localStorage.setItem('lastUrl', event.url);
      }
    });

  }

  updateCurrentUser(user: User) {
    this.authenticationService.currentUser.next(user);
  }

  adminUpdated() {
    this.authenticationService.authenticatedUser.next(this.authenticatedUser);
  }

  ngOnInit() {
    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
      this.refreshImpersonate();
    });
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.refreshImpersonate();
    });
    this.authenticationService.loginUrl.subscribe(loginUrl => this.loginUrl = loginUrl);
  }

  refreshImpersonate() {
    this.impersonate = this.authenticatedUser != null && this.currentUser != null && this.currentUser.id !== this.authenticatedUser.id;
  }

  logout() {
    this.authenticationService.logout();
  }

}
