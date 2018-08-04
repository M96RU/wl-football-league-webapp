import {Component, Output, EventEmitter, Input} from '@angular/core';
import {User} from '../model/user';

@Component({
  selector: 'user-select',
  templateUrl: './user-select.component.html'
})
export class UserSelectComponent {

  @Input()
  users: User[];

  @Input()
  user: User;

  @Input()
  showAllUsers = true;

  @Output() userChange = new EventEmitter();

  onChange() {
    this.userChange.emit(this.user);
  }

}
