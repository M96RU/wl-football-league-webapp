import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Season, SeasonService} from './model/season';

@Injectable()
export class SeasonResolve implements Resolve<Season> {

  constructor(private seasonService: SeasonService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Season> {
    const seasonId = route.params['id'];
    if (seasonId === 'current') {
      return this.seasonService.getLatestSeason().take(1);
    } else  {
      return this.seasonService.getSeason(+seasonId).take(1);
    }
  }

}
