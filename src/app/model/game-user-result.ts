import {GameStatus, GameType} from './game';
import {URLSearchParams} from '@angular/http';

export class GameUserResultFilter {
  status?: GameStatus;
  season?: number;
  user?: number;
  against?: number;
  compet?: GameType;
  division?: number;
  startDate?: Date;
  endDate?: Date;

  sort?: string;
  sort2?: string;
  size?: number;

  static searchParams(filter: GameUserResultFilter, params: URLSearchParams = new URLSearchParams()): URLSearchParams {
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
    if (filter.startDate) {
      params.set('startDate', filter.startDate.toISOString());
    }
    if (filter.endDate) {
      params.set('endDate', filter.endDate.toISOString());
    }
    if (filter.status) {
      params.set('status', String(filter.status));
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

}
