import {Component, Input} from '@angular/core';
import {User} from '../model/user';

@Component({
  selector: 'user-link',
  template: '<a *ngIf="user" routerLink="/users/{{user.id}}" class="link-unstyled" ngbTooltip="Fiche de {{user.firstname}} {{user.lastname}}">{{label? label : user.firstname + " " + user.lastname}}</a>'
})
export class UserLinkComponent {

  @Input()
  user: User;

  @Input()
  label: String;
}
