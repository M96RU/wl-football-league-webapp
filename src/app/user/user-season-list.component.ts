import {Component, OnDestroy, OnInit} from '@angular/core';
import {Season, SeasonService} from '../model/season';
import {UserSeason, UserSeasonService} from '../model/user-season';
import {Subscription} from 'rxjs';

@Component({
  selector: 'user-season-list',
  templateUrl: './user-season-list.component.html'
})
export class UserSeasonListComponent implements OnInit, OnDestroy {

  /**
   * Init
   */
  season: Season;

  /**
   * View
   */
  currentChoice: UserSeason;
  divisions: Set<number>;
  userSeasonPerDivision: Map<number, UserSeason[]> = new Map();

  private userSeasonUpdateSubscription: Subscription;

  constructor(public userSeasonService: UserSeasonService, public seasonService: SeasonService) {
  }

  ngOnInit() {

    this.userSeasonUpdateSubscription = this.userSeasonService.userSeasonUpdated.subscribe(() => {
      this.refresh();
    });

    this.seasonService.getLatestSeason().subscribe(season => {

      this.season = season;
      this.refresh();
    });

  }

  ngOnDestroy() {
    this.userSeasonUpdateSubscription.unsubscribe();
  }

  refresh() {
    this.userSeasonService.search(null, this.season.id, null).subscribe(userSeasons => {

      this.userSeasonPerDivision = new Map();
      this.divisions = new Set();

      const users = userSeasons.sort((u1, u2) => 100 * (u1.division - u2.division) + u1.choice - u2.choice);
      users.forEach(user => {
        this.divisions.add(user.division);
        this.userSeasonPerDivision.set(user.division, this.userSeasonPerDivision.get(user.division) || []);
        this.userSeasonPerDivision.get(user.division).push(user);
      });
      this.currentChoice = users.filter(userSeason => userSeason.team === null).pop();
    });

  }


}
