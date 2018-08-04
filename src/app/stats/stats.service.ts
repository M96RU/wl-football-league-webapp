import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {GameFilter} from '../model/game';
import {Observable} from 'rxjs';
import {UserStats} from '../model/user';
import {deserializeArray} from 'class-transformer';
import {GameUserResultFilter} from '../model/game-user-result';

@Injectable()
export class StatsService {

  private statsUrl = 'api/stats';

  constructor(private http: Http) {
  }

  getStats(gameFilter?: GameUserResultFilter): Observable<UserStats[]> {
    return this.http.get(`${this.statsUrl}`, {search: GameUserResultFilter.searchParams(gameFilter)})
      .map(res => deserializeArray(UserStats, res.text()) );
  }

}
