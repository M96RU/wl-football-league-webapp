import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
import {UserSeason} from './user-season';
import {deserialize, deserializeArray, plainToClass, Type} from 'class-transformer';
import {NotificationsService} from 'angular2-notifications';

export class Season {
  constructor(public id: number, public label: string, public division: number, public cup: number) {
  }
}

export class SeasonUserEntry {
  @Type(() => User)
  user: User;
  division: number;
  previousDivision: number;
  choice: number;
  rank: number;
  points: number;
  goalAverage: number;
}

@Injectable()
export class SeasonService {

  private seasonsUrl = 'api/seasons';

  private dataObs$ = new ReplaySubject<Season[]>(1);

  constructor(private http: Http, private notificationService: NotificationsService) {
  }

  getSeasons(forceRefresh?: boolean): Observable<Season[]> {
    if (!this.dataObs$.observers.length || forceRefresh) {
      this.http.get(this.seasonsUrl)
        .map(res => res.json().content || [])
        .map(parsed => plainToClass(Season, parsed as Object[]))
        .subscribe(
          data => this.dataObs$.next(data),
          error => this.dataObs$.error(error)
        );
    }
    return this.dataObs$;
  }

  getSeason(id: number): Observable<Season> {
    return this.getSeasons().map(seasons => seasons.filter(season => season.id === id)[0]);
  }

  getLatestSeason(): Observable<Season> {
    return this.getSeasons().map(seasons => seasons.reduce((season1, season2) => (season2.id >= season1.id) ? season2 : season1));
  }

  getRanking(seasonId: number, division: number): Observable<UserSeason[]> {
    return this.http.get(`${this.seasonsUrl}/${seasonId}/league/${division}/ranking`)
      .map(res => deserializeArray(UserSeason, res.text()));
  }

  createSeason(seasonUserEntries: Array<SeasonUserEntry>, previous: number, label: String): Observable<Season> {
    return this.http.post(`${this.seasonsUrl}`, {"previous": previous, "label": label, "users": seasonUserEntries})
      .map(res => deserialize(Season, res.text()))
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

}
