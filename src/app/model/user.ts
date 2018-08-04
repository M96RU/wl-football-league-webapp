import {Http, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {GameFilter} from './game';
import {deserialize, plainToClass} from 'class-transformer';
import {NotificationsService} from 'angular2-notifications';

export class User {
  public id: number;
  public das: string;
  public lastname: string;
  public firstname: string;
  public email: string;
  public admin: boolean;

  /**
   * Return shortname with initials and lastname: PM.PAULETA for Pedro-Miguel PAULETA
   * @returns {String}
   */
  getShortName() : String {
    return this.firstname.split("-").map((splited) => {return splited.charAt(0)}).join("") + "." + this.lastname;
  }

}

export class UserFilter {
  public sort?: string;
  public size?: number;

  static searchParams(filter: UserFilter, params: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (!filter) {
      return params;
    }
    if (filter.availableAt) {
      params.set('availableAt', filter.availableAt.toISOString());
    }
    if (filter.sort) {
      params.set('sort', filter.sort);
    }
    if (filter.size) {
      params.set('size', String(filter.size));
    }
    return params;
  }

  constructor(public availableAt?: Date) {}


}

export class UserStats {
  public userId: number;

  public played = 0;

  public scoreFor = 0;
  public regulationTimeFor = 0;
  public overtimeFor = 0;
  public tabFor = 0;

  public scoreAgainst = 0;
  public regulationTimeAgainst = 0;
  public overtimeAgainst = 0;
  public tabAgainst = 0;

  public win = 0;
  public draw = 0;
  public lose = 0;

  public winRegulationTime = 0;
  public winOvertime = 0;
  public winTab = 0;

  public loseRegulationTime = 0;
  public loseOvertime = 0;
  public loseTab = 0;

  get winRatio() {
    return Math.round((this.win / Math.max(this.played, 1)) * 1000) / 10;
  }

  get loseRatio() {
    return Math.round((this.lose / Math.max(this.played, 1)) * 1000) / 10;
  }

  get drawRatio() {
    return Math.round((this.draw / Math.max(this.played, 1)) * 1000) / 10;
  }

  get scoreForPerGame() {
    return Math.round((this.scoreFor / Math.max(this.played, 1)) * 10) / 10;
  }

  get scoreAgainstPerGame() {
    return Math.round((this.scoreAgainst / Math.max(this.played, 1)) * 10) / 10;
  }

  get goalAverage() {
    return this.scoreFor - this.scoreAgainst;
  }

  get goalAveragePerGame() {
    return Math.round((this.goalAverage / Math.max(this.played, 1)) * 10) / 10;
  }
}

@Injectable()
export class UserService {

  private usersUrl = 'api/users';

  private dataObs$ = new ReplaySubject<User[]>(1);

  constructor(private http: Http, private notificationService: NotificationsService) {
  }

  search(userFilter: UserFilter): Observable<User[]> {
    return this.http.get(this.usersUrl, {search: UserFilter.searchParams(userFilter)})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(User, parsed as Object[]))
      .map(users => users.sort((user1, user2) =>  `${user1.firstname} ${user1.lastname}`.toLowerCase().localeCompare(`${user2.firstname} ${user2.lastname}`)));
  }


  getUsers(forceRefresh?: boolean): Observable<User[]> {
    if (!this.dataObs$.observers.length || forceRefresh) {
      this.http.get(this.usersUrl)
        .map(res => res.json().content || [])
        .map(parsed => plainToClass(User, parsed as Object[]))
        .map(users => users.sort((user1, user2) =>  `${user1.firstname} ${user1.lastname}`.toLowerCase().localeCompare(`${user2.firstname} ${user2.lastname}`)))
        .subscribe(
          data => this.dataObs$.next(data),
          error => this.dataObs$.error(error)
        );
    }
    return this.dataObs$;
  }

  getLoginUrl(): Observable<String> {
    return this.http.get(`${this.usersUrl}/loginUrl`).map(res => res.text());
  }

  getCurrentUser(): Observable<User> {
    return this.http.get(`${this.usersUrl}/current`)
      .map(res => {
        if (res.status === 200) {
          return deserialize(User, res.text());
        } else {
          return null;
        }
      });
  }

  getUser(id: number): Observable<User> {
    return this.getUsers().map(users => users.filter(user => user.id === id)[0]);
  }

  getUserStats(userId: number, gameFilter?: GameFilter): Observable<UserStats> {
    return this.http.get(`${this.usersUrl}/${userId}/stats`, {search: GameFilter.searchParams(gameFilter)})
      .map(res => deserialize(UserStats, res.text()));
  }

  create(user: User): Observable<User> {
    return this.http.post(`${this.usersUrl}`, user)
      .map(res => deserialize(User, res.text()))
      .catch((err, ex) => {
        this.notificationService.error('Erreur de création', err.message);
        return Observable.throw(err);
      });
  }

}
