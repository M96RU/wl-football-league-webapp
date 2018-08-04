import {User} from './user';
import {Type, plainToClass, deserialize} from 'class-transformer';
import {Injectable} from '@angular/core';
import {URLSearchParams, Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs';

export class UserAvailability {
  id: number;
  user: User;
  @Type(() => Date)
  date: Date;
}

export class UserAvailabilityFilter {

  static searchParams(filter: UserAvailabilityFilter, params: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (!filter) {
      return params;
    }
    if (filter.userId) {
      params.set('userId', String(filter.userId));
    }
    if (filter.dates) {
      for (const date of filter.dates) {
        params.append('dates', date.toISOString());
      }
    }
    return params;
  }

  constructor(public userId?: number, public dates?: Date[]) {}

}

@Injectable()
export class UserAvailabilityService {

  private availabilityUrl = 'api/availability';

  constructor(private http: Http) {
  }

  search(filter: UserAvailabilityFilter = null): Observable<UserAvailability[]> {
    return this.http.get(this.availabilityUrl, {search: UserAvailabilityFilter.searchParams(filter)})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(UserAvailability, parsed as Object[]));
  }

  declareAvailable(userId: number, date: Date, available: boolean): Observable<UserAvailability> {
    return this.http.request(`${this.availabilityUrl}/${date.toISOString()}/${userId}`, { method: available ? RequestMethod.Post : RequestMethod.Delete })
      .map(res => deserialize(UserAvailability, res.text()));
  }

}
