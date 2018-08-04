import {User} from './user';
import {Team} from './team';
import {Game, GameFilter} from './game';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {Type, deserializeArray, deserialize} from 'class-transformer';

export class Serie {
  id: number;
  @Type(() => User)
  user: User;
  @Type(() => Team)
  team: Team;
  @Type(() => SerieMatch)
  matches: SerieMatch[];
  points: number;
  goalAverage: number;
}

export class SerieMatch {
  @Type(() => Game)
  match: Game;
  points: number;
  goalAverage: number;
}

@Injectable()
export class SerieService {

  private seriesUrl = 'api/users/series';

  constructor(private http: Http) {
  }

  getSeries(gameFilter: GameFilter): Observable<Serie[]> {
    return this.http.get(`${this.seriesUrl}`, {search: GameFilter.searchParams(gameFilter)})
      .map(res => deserializeArray(Serie, res.text()));
  }

  getSerie(userId: number, gameFilter: GameFilter): Observable<Serie> {
    return this.http.get(`${this.seriesUrl}/${userId}`, {search: GameFilter.searchParams(gameFilter)})
      .map(res => deserialize(Serie, res.text()));
  }

}
