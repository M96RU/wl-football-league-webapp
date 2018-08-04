import {PipeTransform, Pipe} from '@angular/core';
import {User} from '../model/user';


@Pipe({name: 'usersSort'})
export class UsersSortPipe implements PipeTransform {

  transform(users: User[]): User[] {
    if (users) {
      return users.sort((user1, user2) => `${user1.firstname} ${user1.lastname}`.toLowerCase().localeCompare(`${user2.firstname} ${user2.lastname}`))
    } else {
      return users;
    }
  }

}
