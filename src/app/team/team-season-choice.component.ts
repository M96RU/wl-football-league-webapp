import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TeamSeasonService} from "../model/team-season";
import {Team} from "../model/team";
import {UserSeason, UserSeasonService} from "../model/user-season";

@Component({
  selector: 'team-season-choice',
  templateUrl: './team-season-choice.component.html'
})
export class TeamSeasonChoiceComponent implements OnInit {

  @Input()
  team: Team;

  @Input()
  userSeason: UserSeason;

  @Output()
  unselectChoosenTeam = new EventEmitter();

  constructor(private userSeasonService: UserSeasonService) {
  }

  ngOnInit() {
  }

  confirmChoice() {
    this.userSeasonService.updateTeam(this.userSeason.id, this.team.id).subscribe();
    this.unselectChoosenTeam.emit(this.team);
  }

  cancelChoice() {
    this.unselectChoosenTeam.emit(this.team);
  }

}
