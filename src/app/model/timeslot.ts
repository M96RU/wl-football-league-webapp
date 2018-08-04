import {Type, plainToClass, deserialize} from 'class-transformer';
import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';

export class Timeslot {
  id: number;

  @Type(() => Date)
  date: Date;
}

export class TimeslotFilter {
  startDate?: Date;
  available?: Boolean;
  sort?: string;
  size?: number;

  static searchParams(filter: TimeslotFilter, params: URLSearchParams = new URLSearchParams()): URLSearchParams {
    if (!filter) {
      return params;
    }
    if (filter.startDate) {
      params.set('startDate', filter.startDate.toISOString());
    }
    if (filter.available != null) {
      params.set('available', String(filter.available));
    }
    if (filter.sort) {
      params.set('sort', filter.sort);
    }
    if (filter.size) {
      params.set('size', String(filter.size));
    }
    return params;
  }
}

@Injectable()
export class TimeslotService {

  private timeslotsUrl = 'api/timeslots';

  constructor(private http: Http) {
  }

  search(filter: TimeslotFilter = null): Observable<Timeslot[]> {
    return this.http.get(this.timeslotsUrl, {search: TimeslotFilter.searchParams(filter)})
      .map(res => res.json().content || [])
      .map(parsed => plainToClass(Timeslot, parsed as Object[]));
  }

  create(date: Date): Observable<Timeslot> {
    const ts = new Timeslot();
    ts.date = date;
    return this.http.post(this.timeslotsUrl, ts)
      .map(res => deserialize(Timeslot, res.text()));
  }

  delete(timeslotId: number): Observable<void> {
    return this.http.delete(`${this.timeslotsUrl}/${timeslotId}`)
      .map(res => null);
  }

}
