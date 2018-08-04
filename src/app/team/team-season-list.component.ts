import {Component, OnDestroy, OnInit} from '@angular/core';
import {Season} from '../model/season';
import {Team, TeamService} from '../model/team';
import {TeamSeason, TeamSeasonService, UserTeamSeason} from "../model/team-season";
import {AuthenticationService} from "../authentication.service";
import {User} from "../model/user";
import {ActivatedRoute} from "@angular/router";
import {UserSeason, UserSeasonService} from "../model/user-season";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'team-season-list',
  templateUrl: './team-season-list.component.html'
})
export class TeamSeasonListComponent implements OnInit, OnDestroy {

  /**
   * View
   */
  selectedTeam: UserTeamSeason = null;
  userTeamSeasons: UserTeamSeason[] = null;
  formTeamSeason: TeamSeason = null;
  choosenTeam: UserTeamSeason = null;

  /**
   * Teams
   */
  season: Season;
  teams: Team[];
  teamSeasons: TeamSeason[];

  /**
   * User Choice
   */
  private userSeasonUpdateSubscription: Subscription;
  currentChoice: UserSeason;
  userSeasons: UserSeason[] = [];

  /**
   * Current user
   */
  currentUser: User;
  authenticatedUser: User;
  adminOrCurrentUser: boolean;

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private userSeasonService: UserSeasonService,
              public teamService: TeamService,
              public teamSeasonService: TeamSeasonService) {
  }

  ngOnDestroy() {
    this.userSeasonUpdateSubscription.unsubscribe();
  }

  ngOnInit() {


    this.userSeasonUpdateSubscription = this.userSeasonService.userSeasonUpdated.subscribe(() => {
      this.refreshUserChoices();
    });

    this.route.parent.data.subscribe((data: { season: Season }) => {
      this.season = data.season;

      this.teamService.all('label,ASC').subscribe(teams => {
        this.teams = teams;
        this.refreshTeamSeasons();
      });
    });

    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateAdminOrCurrentUser();
    });
    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
      this.updateAdminOrCurrentUser();
    });


  }

  refreshView() {

    const userTeamSeasons = [];

    this.teams.forEach(team => {
      const userTeamSeason = new UserTeamSeason();
      userTeamSeason.team = team;
      userTeamSeason.userSeason = this.userSeasons.filter((userSeason) => userSeason.team != null && userSeason.team.id === team.id).pop();
      userTeamSeason.teamSeason = this.teamSeasons.filter((teamSeason) => teamSeason.team.id === team.id).pop();
      userTeamSeasons.push(userTeamSeason);
    });

    this.userTeamSeasons = userTeamSeasons.sort((ut1, ut2) => {
      if (!ut1.teamSeason) {
        return 1;
      }
      if (!ut2.teamSeason) {
        return -1;
      }
      return ut2.teamSeason.overall - ut1.teamSeason.overall
    });
  }

  refreshTeamSeasons() {

    this.teamSeasonService.search(null, this.season.id).subscribe(teamSeasons => {
      this.teamSeasons = teamSeasons;
      this.refreshUserChoices();
    });
  }

  teamSeasonSelected(userTeamSeason: UserTeamSeason) {
    this.choosenTeam = null;
    this.selectedTeam = userTeamSeason;

    if (this.selectedTeam.teamSeason) {
      this.formTeamSeason = this.selectedTeam.teamSeason;
    } else {
      const newFormTeamSeason = new TeamSeason();
      newFormTeamSeason.season = this.season;
      newFormTeamSeason.team = this.selectedTeam.team;
      newFormTeamSeason.division = 1;
      newFormTeamSeason.attack = 80;
      newFormTeamSeason.midfield = 80;
      newFormTeamSeason.defence = 80;
      this.formTeamSeason = newFormTeamSeason;
    }
  }

  updateAdminOrCurrentUser() {
    this.adminOrCurrentUser = this.currentUser != null && this.authenticatedUser != null && (this.authenticatedUser.admin || this.currentUser.id === this.authenticatedUser.id);
  }

  handleTeamSeasonUpdate(teamSeasonUpdate: TeamSeason) {
    this.formTeamSeason = null;
    this.refreshTeamSeasons();
  }

  refreshUserChoices() {
    this.userSeasonService.search(null, this.season.id, null).subscribe(userSeasons => {
      this.userSeasons = userSeasons.sort((u1, u2) => 100 * (u1.division - u2.division) + u1.choice - u2.choice);
      this.currentChoice = this.userSeasons.filter((userSeason => userSeason.team === null)).pop();
      this.refreshView();
    });
  }

  chooseTeam(userTeamSeason : UserTeamSeason) {
    this.formTeamSeason = null;
    this.choosenTeam = userTeamSeason;
    this.refreshView();
  }

  handleUnselectChoosenTeam(team: Team) {
    this.choosenTeam = null;
  }
}
