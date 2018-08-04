import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Season, SeasonService, SeasonUserEntry} from '../model/season';
import {User, UserService} from '../model/user';
import {UserSeasonService} from '../model/user-season';

@Component({
  selector: 'app-season-create',
  templateUrl: './season-create.component.html'
})
export class SeasonCreateComponent implements OnInit {

  season: Season;
  seasonUserEntries: SeasonUserEntry[];

  users: User[] = [];
  availableUsers: Set<User>;

  labelInit: String = "Saison X";
  divisions: Set<number>;
  usersPerDivision: Map<number, SeasonUserEntry[]> = new Map();


  constructor(private route: ActivatedRoute, private router: Router,
              public userSeasonService: UserSeasonService,
              public seasonService: SeasonService,
              public userService: UserService) {
  }

  createSeason(label: String) {
    this.seasonService.createSeason(this.seasonUserEntries, this.season.id, label).subscribe(season => {
      this.router.navigate(['/']);
    });
  }


  ngOnInit() {

    this.userService.getUsers(true).subscribe(users => this.users = users);

    this.route.parent.data.subscribe((data: { season: Season }) => {

      this.season = data.season;

      this.seasonUserEntries = [];

      this.userSeasonService.search(null, this.season.id, null).subscribe(userSeasons => {

        userSeasons.forEach(userSeason => {
          const seasonUserEntry = new SeasonUserEntry();
          seasonUserEntry.division = userSeason.division;
          seasonUserEntry.previousDivision = userSeason.division;
          seasonUserEntry.choice = userSeason.rank;
          seasonUserEntry.rank = userSeason.rank;
          seasonUserEntry.user = userSeason.user;
          seasonUserEntry.points = userSeason.points;
          seasonUserEntry.goalAverage = userSeason.goalAverage;
          this.seasonUserEntries.push(seasonUserEntry);
        });

        this.refresh();
      });
    });
  }

  refresh() {
    this.usersPerDivision = new Map();
    this.divisions = new Set();
    this.seasonUserEntries.sort((u1, u2) => 100 * (u1.division - u2.division) + u1.choice - u2.choice).forEach(seasonUserEntry => {
      this.divisions.add(seasonUserEntry.division);
      this.usersPerDivision.set(seasonUserEntry.division, this.usersPerDivision.get(seasonUserEntry.division) || []);
      this.usersPerDivision.get(seasonUserEntry.division).push(seasonUserEntry);
    });

    this.availableUsers = new Set();
    this.users.forEach(user => {
      if (this.seasonUserEntries.filter((u) => u.user.id === user.id).length === 0) {
        this.availableUsers.add(user);
      }
    });
  }

  promote(promoteUser: SeasonUserEntry) {

    var newChoice = 1;

    this.seasonUserEntries.forEach(entry => {
      // update choices for new division
      if (entry.division == promoteUser.division - 1 && entry.choice >= newChoice) {
        newChoice = entry.choice + 1;
      }
    });

    this.seasonUserEntries.forEach(entry => {
      // update choices for previous division
      if (entry.division == promoteUser.division && entry.choice > promoteUser.choice) {
        entry.choice--;
      }
    });

    // relegate user with first choice
    promoteUser.division--;
    promoteUser.choice = newChoice;

    // refresh view
    this.refresh();
  }

  fold(foldUser: SeasonUserEntry) {

    this.seasonUserEntries.forEach(entry => {
      // update choices for new division
      if (entry.division == foldUser.division && entry.choice > foldUser.choice) {
        entry.choice--;
      }
    });

    // relegate user with first choice
    var index = this.seasonUserEntries.indexOf(foldUser);
    if (index >= 0) {
      this.seasonUserEntries.splice(index, 1);
    }

    // refresh view
    this.refresh();
  }

  relegate(relegatedEntry: SeasonUserEntry) {

    this.seasonUserEntries.forEach(entry => {
      // update choices for new division
      if (entry.division == 1 + relegatedEntry.division) {
        entry.choice++;
      }
      // update choices for previous division
      if (entry.division == relegatedEntry.division && entry.choice > relegatedEntry.choice) {
        entry.choice--;
      }
    });

    // relegate user with first choice
    relegatedEntry.division++;
    relegatedEntry.choice = 1;

    // refresh view
    this.refresh();
  }

  choiceUp(upEntry: SeasonUserEntry) {

    this.seasonUserEntries.forEach(entry => {
      // exchange choice
      if (entry.division == upEntry.division && entry.choice == upEntry.choice - 1) {
        entry.choice++;
      }
    });

    // update choice
    upEntry.choice--;

    // refresh view
    this.refresh();
  }

  choiceDown(downEntry: SeasonUserEntry) {
    this.seasonUserEntries.forEach(entry => {
      // exchange choice
      if (entry.division == downEntry.division && entry.choice == downEntry.choice + 1) {
        entry.choice--;
      }
    });

    // update choice
    downEntry.choice++;

    // refresh view
    this.refresh();
  }

  select(user: User) {
    const newUserEntry = new SeasonUserEntry();
    newUserEntry.user = user;
    newUserEntry.division = this.divisions.size;
    newUserEntry.choice = 1;

    this.seasonUserEntries.forEach(entry => {
      // exchange choice
      if (entry.division == newUserEntry.division) {
        entry.choice++;
      }
    });

    this.seasonUserEntries.push(newUserEntry);

    // refresh view
    this.refresh();
  }

  handleUserCreate(user: User) {
    this.users.push(user);
    this.select(user);
  }

}
