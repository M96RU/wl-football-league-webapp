import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
import {Type, plainToClass} from 'class-transformer';
import {NotificationsService} from 'angular2-notifications';

export class Team {
  constructor(public id: number, public label: string) {
  }
}

export class TeamChoice {
  @Type(() => User)
  user: User;
  @Type(() => Team)
  team: Team;
}


@Injectable()
export class TeamService {

  private teamsUrl = 'api/teams';


  constructor(private http: Http, private notificationService: NotificationsService) {
  }

  all(sort): Observable<Team[]> {
    const params = new URLSearchParams();
    params.set('sort', sort);
    return this.http.get(`${this.teamsUrl}`, {search: params})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(Team, parsed as Object[]));
  }

}
