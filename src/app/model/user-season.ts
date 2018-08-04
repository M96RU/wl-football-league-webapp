import {Injectable, Inject, forwardRef} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {User} from './user';
import {Team} from './team';
import {Season} from './season';
import {plainToClass, Type, deserialize} from 'class-transformer';
import {Subject} from 'rxjs/Subject';
import {SocketService} from '../socket.service';
import {UserNamePipe} from '../userName.pipe';
import {NotificationsService} from 'angular2-notifications';


export class UserSeason {
  id: number;
  @Type(() => User)
  user: User;
  @Type(() => Season)
  season: Season;
  @Type(() => Team)
  team: Team;
  division: number;
  choice: number;
  played: number;
  rank: number;
  leagueWinner: boolean;
  goalFor: number;
  goalAgainst: number;
  won: number;
  draw: number;
  lose: number;
  goalAverage: number;
  points: number;
  cupRound: number;
  cupWinner: boolean;
  cupInProgress: boolean;
}

@Injectable()
export class UserSeasonService {

  private userSeasonsUrl = 'api/userSeasons';

  userSeasonUpdated = new Subject<UserSeason>();


  constructor(private http: Http, @Inject(forwardRef(() => SocketService)) public socketService: SocketService, private notificationService: NotificationsService, private userNamePipe: UserNamePipe) {
    this.userSeasonUpdated = socketService.userSeasonUpdated;
  }

  search(userId?: number, seasonId?: number, winSomething?: boolean): Observable<UserSeason[]> {
    const params = new URLSearchParams();
    if (userId) {
      params.set('userId', String(userId));
    }
    if (seasonId) {
      params.set('seasonId', String(seasonId));
    }
    if (winSomething) {
      params.set('winSomething', String(winSomething));
    }
    return this.http.get(this.userSeasonsUrl, {search: params})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(UserSeason, parsed as Object[]));
  }

  updateTeam(id: number, teamId: number): Observable<UserSeason> {
    return this.http.post(`${this.userSeasonsUrl}/${id}/team`, {"team" : teamId})
      .map(res => {
        return deserialize(UserSeason, res.text());
      })
      .do((game: UserSeason) => {
        return this.notificationService.success('Choix d\'équipe mis à jour', 'Equipe mis à jour');
      })
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

}
