import {User} from './user';
import {Game} from './game';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {deserialize, Type, plainToClass} from 'class-transformer';

export class Baton {
  id: number;
  @Type(() => User)
  user: User;
  @Type(() => User)
  lostAgainst: User;
  @Type(() => Game)
  wonGame: Game;
  @Type(() => Game)
  lostGame: Game;
  @Type(() => Date)
  wonDate: Date;
  @Type(() => Date)
  lostDate: Date;
  sinceGames: number;
  forced: boolean;
}

@Injectable()
export class BatonService {

  private batonsUrl = 'api/batons';

  constructor(private http: Http) {
  }

  all(sort = 'wonDate,asc'): Observable<Baton[]> {
    const params = new URLSearchParams();
    params.set('sort', sort);
    return this.http.get(`${this.batonsUrl}`, {search: params})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(Baton, parsed as Object[]));
  }

  current(): Observable<Baton> {
    return this.http.get(`${this.batonsUrl}/current`)
      .map(res => deserialize(Baton, res.text()));
  }

  games(batonId: number): Observable<Game[]> {
    return this.http.get(`${this.batonsUrl}/${batonId}/games`)
      .map(res => res.json() || [])
      .map(parsed => plainToClass(Game, parsed as Object[]));
  }

}
