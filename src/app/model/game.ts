import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {Team} from './team';
import {Season} from './season';
import {plainToClass, Type, deserialize} from 'class-transformer';
import {Subject} from 'rxjs/Subject';
import {SocketService} from '../socket.service';
import {UserNamePipe} from '../userName.pipe';
import {NotificationsService} from 'angular2-notifications';

export enum GameStatus {
  INIT = <any>'INIT',
  PLANNED = <any>'PLANNED',
  PLAYED = <any>'PLAYED',
  CANCELLED = <any>'CANCELLED'
}

export enum GameOutcome {
  WIN = <any>'WIN',
  DRAW = <any>'DRAW',
  LOSE = <any>'LOSE'
}

export enum GameType {
  LEAGUE = <any>'LEAGUE',
  CUP = <any>'CUP',
  FRIENDLY = <any>'FRIENDLY'
}

export class GameResult {
  date: Date;
  score1: number;
  score2: number;
  prolongation1?: number;
  prolongation2?: number;
  tab1?: number;
  tab2?: number;
}

export class Game {
  id: number;
  @Type(() => Date)
  date: Date;
  season: Season;
  compet?: GameType;
  day?: number;
  round?: number;
  @Type(() => User)
  user1?: User;
  @Type(() => Team)
  team1?: Team;
  @Type(() => User)
  user2?: User;
  @Type(() => Team)
  team2?: Team;
  status?: GameStatus;
  score1?: number;
  score2?: number;
  prolongation1?: number;
  prolongation2?: number;
  tab1?: number;
  tab2?: number;
}

export class GameFilter {
  status?: GameStatus;
  season?: number;
  user?: number;
  against?: number;
  compet?: GameType;
  cupRound?: number;
  division?: number;
  day?: number;
  hasDate?: boolean;
  date?: Date;
  dates?: Date[];
  startDate?: Date;
  endDate?: Date;
  availableAt?: Date;
  availableCount?: number;

  sort?: string;
  sort2?: string;
  size?: number;

  static searchParams(filter: GameFilter, params: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (!filter) {
      return params;
    }
    if (filter.season) {
      params.set('season', String(filter.season));
    }
    if (filter.division) {
      params.set('division', String(filter.division));
    }
    if (filter.user) {
      params.set('user', String(filter.user));
    }
    if (filter.against) {
      params.set('against', String(filter.against));
    }
    if (filter.compet) {
      params.set('compet', String(filter.compet));
    }
    if (filter.hasDate) {
      params.set('hasDate', String(filter.hasDate));
    }
    if (filter.date) {
      params.set('date', filter.date.toISOString());
    }
    if (filter.dates) {
      for (const date of filter.dates) {
        params.append('dates', date.toISOString());
      }
    }
    if (filter.startDate) {
      params.set('startDate', filter.startDate.toISOString());
    }
    if (filter.endDate) {
      params.set('endDate', filter.endDate.toISOString());
    }
    if (filter.status) {
      params.set('status', String(filter.status));
    }
    if (filter.availableAt) {
      params.set('availableAt', filter.availableAt.toISOString());
    }
    if (filter.availableCount) {
      params.set('availableCount', String(filter.availableCount));
    }
    if (filter.sort) {
      params.append('sort', filter.sort);
    }
    if (filter.sort2) {
      params.append('sort', filter.sort2);
    }
    if (filter.size) {
      params.set('size', String(filter.size));
    }
    return params;
  }

  static match(filter: GameFilter, game: Game): boolean {
    let match = true;
    if (filter) {
      match = match && (!filter.status || game.status === filter.status);
      match = match && (!filter.season || game.season.id === filter.season);
      match = match && (!filter.user || game.user1 && game.user1.id === filter.user || game.user2 && game.user2.id === filter.user);
      match = match && (!filter.against || game.user1 && game.user1.id === filter.against || game.user2 && game.user2.id === filter.against);
      match = match && (!filter.compet || game.compet === filter.compet);
      match = match && (!filter.cupRound || game.round === filter.cupRound && game.compet === GameType.CUP);
      match = match && (!filter.division || game.round === filter.division && game.compet === GameType.LEAGUE);
      match = match && (!filter.day || game.day === filter.day && game.compet === GameType.LEAGUE);
    }
    return match;
  }

}

@Injectable()
export class GameService {

  private gamesUrl = 'api/games';

  gameUpdated = new Subject<Game>();

  constructor(private http: Http, private socketService: SocketService, private notificationService: NotificationsService, private userNamePipe: UserNamePipe) {
    this.gameUpdated = socketService.gameUpdated;
  }

  search(gameFilter: GameFilter): Observable<Game[]> {
    return this.http.get(this.gamesUrl, {search: GameFilter.searchParams(gameFilter)})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(Game, parsed as Object[]));
  }

  updateResult(id: number, gameResult: GameResult): Observable<Game> {
    return this.http.post(`${this.gamesUrl}/${id}/result`, gameResult)
      .map(res => {
        return deserialize(Game, res.text());
      })
      .do((game: Game) => {
        return this.notificationService.success('Match mis à jour', this.userNamePipe.transform(game.user1) + ' vs ' + this.userNamePipe.transform(game.user2) + ' mis à jour');
      })
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

  generateGames(season: number, division: number): Observable<void> {
    return this.http.post(`${this.gamesUrl}/generate?division=${division}&season=${season}`, {})
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

  cancel(id: number): Observable<Game> {
    return this.http.post(`${this.gamesUrl}/${id}/cancel`, {})
      .map(res => {
        return deserialize(Game, res.text());
      })
      .do((game: Game) => {
        return this.notificationService.success('Match annulé', this.userNamePipe.transform(game.user1) + ' vs ' + this.userNamePipe.transform(game.user2) + ' annulé');
      })
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

}
