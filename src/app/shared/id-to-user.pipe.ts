import {PipeTransform, Pipe} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService, User} from '../model/user';

@Pipe({name: 'idToUser'})
export class IdToUserPipe implements PipeTransform {

  constructor(private userService: UserService) {
  }

  transform(userId: number): Observable<User> {
    return this.userService.getUser(userId);
  }

}
