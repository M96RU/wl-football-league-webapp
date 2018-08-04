import {Injectable} from '@angular/core';
import {User, UserService} from './model/user';
import {Subject, BehaviorSubject} from 'rxjs';
import {Http} from '@angular/http';
import 'rxjs/add/operator/do'

@Injectable()
export class AuthenticationService {

  authenticatedUser = new BehaviorSubject<User>(null);
  currentUser = new BehaviorSubject<User>(null);
  loginUrl = new Subject<String>();

  constructor(private userService: UserService, private http: Http) {
    this.refreshCurrentUser().subscribe();
    this.userService.getLoginUrl().subscribe(loginUrl => this.loginUrl.next(loginUrl));
  }

  logout(): void {
    this.http.get('/api/logout').subscribe(_ => {
      this.authenticatedUser.next(null);
      this.currentUser.next(null);
    });
  }

  refreshCurrentUser() {
    return this.userService.getCurrentUser().do(user => {
      this.authenticatedUser.next(user);
      this.currentUser.next(user);
    });
  }

}
