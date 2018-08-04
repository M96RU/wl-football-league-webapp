import {Component, Input} from '@angular/core';
import {Team} from '../model/team';

@Component({
  selector: 'app-team-flag',
  template: '<img *ngIf="team" src="/assets/teams/{{responsive?300:size}}/{{team.id}}.png" ngbTooltip="{{team.label}}" [class.img-fluid]="responsive"/><img *ngIf="!team" src="/assets/teams/{{responsive?300:size}}/default.png" [class.img-fluid]="responsive"/>'
})
export class TeamFlagComponent {

  @Input() team: Team;

  @Input() size: number = 20;

  @Input() responsive: boolean = false;
}
