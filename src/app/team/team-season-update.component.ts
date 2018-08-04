import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TeamSeason, TeamSeasonCreate, TeamSeasonService, TeamSeasonUpdate} from "../model/team-season";
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'team-season-update',
  templateUrl: './team-season-update.component.html'
})
export class TeamSeasonUpdateComponent implements OnInit {

  @Input()
  formTeamSeason: TeamSeason;

  @Output()
  teamSeasonUpdate = new EventEmitter();
  private teamSeasonCreateForm: FormGroup;

  constructor(public fb: FormBuilder, private teamSeasonService: TeamSeasonService, private notificationsService: NotificationsService) {
    this.teamSeasonCreateForm = fb.group({
      'division': [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(5)])],
      'attack': [null, Validators.compose([Validators.required, Validators.min(50), Validators.max(99)])],
      'midfield': [null, Validators.compose([Validators.required, Validators.min(50), Validators.max(99)])],
      'defence': [null, Validators.compose([Validators.required, Validators.min(50), Validators.max(99)])]
    });
  }

  ngOnInit() {
  }

  cancel() {
    this.teamSeasonUpdate.emit(null);
    this.teamSeasonCreateForm.reset();
  }

  save() {

    if (this.formTeamSeason != null) {

      if (this.teamSeasonCreateForm.dirty && this.teamSeasonCreateForm.invalid) {

        if (this.teamSeasonCreateForm.controls["division"].errors) {
          this.notificationsService.alert("Mise à jour impossible", "La division doit être comprise entre 1 et 5");
        }

        if (this.teamSeasonCreateForm.controls["attack"].errors) {
          this.notificationsService.alert("Mise à jour impossible", "La note d'attaque doit être comprise entre 50 et 99");
        }

        if (this.teamSeasonCreateForm.controls["midfield"].errors) {
          this.notificationsService.alert("Mise à jour impossible", "La note du milieu doit être comprise entre 50 et 99");
        }

        if (this.teamSeasonCreateForm.controls["defence"].errors) {
          this.notificationsService.alert("Mise à jour impossible", "La note de défense doit être comprise entre 50 et 99");
        }

      } else if (this.formTeamSeason.id != null) {
        this.update();
      } else {
        this.create();
      }

    }
  }


  create() {
    const teamSeasonCreate = new TeamSeasonCreate();
    teamSeasonCreate.team = this.formTeamSeason.team.id;
    teamSeasonCreate.season = this.formTeamSeason.season.id;
    teamSeasonCreate.division = this.formTeamSeason.division;
    teamSeasonCreate.attack = this.formTeamSeason.attack;
    teamSeasonCreate.midfield = this.formTeamSeason.midfield;
    teamSeasonCreate.defence = this.formTeamSeason.defence;
    this.teamSeasonService.create(teamSeasonCreate).subscribe(createdTeamSeason => {
      this.teamSeasonUpdate.emit(createdTeamSeason);
      this.teamSeasonCreateForm.reset();
    });
  }

  update() {
    const teamSeasonUpdate = new TeamSeasonUpdate();
    teamSeasonUpdate.division = this.formTeamSeason.division;
    teamSeasonUpdate.attack = this.formTeamSeason.attack;
    teamSeasonUpdate.midfield = this.formTeamSeason.midfield;
    teamSeasonUpdate.defence = this.formTeamSeason.defence;
    this.teamSeasonService.update(this.formTeamSeason.id, teamSeasonUpdate).subscribe(createdTeamSeason => {
      this.teamSeasonUpdate.emit(createdTeamSeason);
      this.teamSeasonCreateForm.reset();
    });
  }


}
