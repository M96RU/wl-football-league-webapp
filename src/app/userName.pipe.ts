import {PipeTransform, Pipe} from '@angular/core';
import {User} from './model/user';

@Pipe({name: 'userName'})
export class UserNamePipe implements PipeTransform {

  transform(user: User): String {
    if (user) {
      return `${user.firstname} ${user.lastname}`;
    } else {
      return '';
    }
  }

}
