import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {Team} from './team';
import {Season} from './season';
import {deserialize, plainToClass, Type} from 'class-transformer';
import {NotificationsService} from 'angular2-notifications';
import {UserSeason} from "./user-season";

export class UserTeamSeason {
  @Type(() => Team)
  team: Team;
  @Type(() => UserSeason)
  userSeason: UserSeason;
  @Type(() => TeamSeason)
  teamSeason: TeamSeason;
}

export class TeamSeason {
  id: number;
  @Type(() => Season)
  season: Season;
  @Type(() => Team)
  team: Team;
  division: number;
  attack: number;
  midfield: number;
  defence: number;
  overall: number;
}

export class TeamSeasonCreate {
  season: number;
  team: number;
  division: number;
  attack: number;
  midfield: number;
  defence: number;
}

export class TeamSeasonUpdate {
  division: number;
  attack: number;
  midfield: number;
  defence: number;
}

@Injectable()
export class TeamSeasonService {

  private teamSeasonsUrl = 'api/teamSeasons';

  constructor(private http: Http, private notificationService: NotificationsService) {
  }

  search(teamId?: number, seasonId?: number): Observable<TeamSeason[]> {
    const params = new URLSearchParams();
    if (teamId) {
      params.set('teamId', String(teamId));
    }
    if (seasonId) {
      params.set('seasonId', String(seasonId));
    }
    return this.http.get(this.teamSeasonsUrl, {search: params})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(TeamSeason, parsed as Object[]));
  }

  create(teamSeasonCreateBody: TeamSeasonCreate): Observable<TeamSeason> {
    return this.http.post(`${this.teamSeasonsUrl}`, teamSeasonCreateBody)
      .map(res => {
        return deserialize(TeamSeason, res.text());
      })
      .do((teamSeason: TeamSeason) => {
        return this.notificationService.success('Note d\'équipe créée', 'Création ok');
      })
      .catch((err, ex) => {
        this.notificationService.error('Erreur de création', err.message);
        return Observable.throw(err);
      });
  }

  update(teamSeasonId: number, teamSeasonUpdateBody: TeamSeasonUpdate): Observable<TeamSeason> {
    return this.http.post(`${this.teamSeasonsUrl}/${teamSeasonId}`, teamSeasonUpdateBody)
      .map(res => {
        return deserialize(TeamSeason, res.text());
      })
      .do((teamSeason: TeamSeason) => {
        return this.notificationService.success('Note d\'équipe mise à jour', 'Mise à jour ok');
      })
      .catch((err, ex) => {
        this.notificationService.error('Erreur de mise à jour', err.message);
        return Observable.throw(err);
      });
  }

}
