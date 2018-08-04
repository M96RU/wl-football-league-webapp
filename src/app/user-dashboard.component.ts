import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {User} from './model/user';
import {UserSeason, UserSeasonService} from './model/user-season';
import {ActivatedRoute} from '@angular/router';
import {GameService, GameFilter} from './model/game';
import {GameFilterComponent} from './game-filter.component';
import {SerieService, Serie} from './model/series';
import {Subscription} from 'rxjs';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'user-dashboard',
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  user: User;

  serie: Serie;

  selectedUserSeason: UserSeason;

  selectedSeasonId: number;

  public userSeasons: UserSeason[];

  gameQuery: GameFilter;

  @ViewChild(GameFilterComponent)
  private gameFilter: GameFilterComponent;

  private gameUpdateSubscription: Subscription;

  constructor(private userSeasonService: UserSeasonService, private route: ActivatedRoute, private serieService: SerieService, private gameService: GameService) {
  }

  ngOnInit() {
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => this.refresh());
    this.route.data.subscribe((data: {user: User}) => {
      this.user = data.user;
      this.refresh();
    });
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
    this.selectedSeasonId = null;
    this.selectedUserSeason = null;
  }

  refresh() {
    this.userSeasonService.search(this.user.id).subscribe(userSeasons => {
      this.userSeasons = userSeasons.reverse();
      const latestSeason = userSeasons.reduce((s1, s2) => (s1.id > s2.id) ? s1 : s2);
      if (isNullOrUndefined(this.selectedSeasonId)) {
        this.updateSelectedUserSeason(latestSeason);
      } else {
        const matchingUserSeasons = this.userSeasons.filter((userSeason => userSeason.season.id === this.selectedSeasonId));
        if (matchingUserSeasons.length === 1) {
          this.updateSelectedUserSeason(matchingUserSeasons[0]);
        } else {
          this.updateSelectedUserSeason(latestSeason);
        }
      }
    });
    this.serieService.getSerie(this.user.id, null).subscribe(serie => this.serie = serie);
  }

  updateSelectedUserSeason(userSeason: UserSeason) {
    this.selectedSeasonId = userSeason.season.id;
    this.selectedUserSeason = userSeason;
    this.gameQuery = new GameFilter();
    this.gameQuery.season = this.selectedUserSeason.season.id;
    this.gameQuery.user = this.user.id;
    this.gameQuery.sort = 'date,asc';
    if (this.gameFilter) {
      this.gameFilter.reset();
    }
  }

  getIconName() {
    if (this.user.lastname.toLowerCase() === 'fabris') {
      return 'wheelchair-alt';
    }
    if (this.user.lastname.toLowerCase() === 'stockreisser') {
      return 'intersex';
    }
    if (this.user.lastname.toLowerCase() === 'russo') {
      return 'ambulance';
    }
    if (this.user.lastname.toLowerCase() === 'vanackere') {
      return 'trophy';
    }
    if (this.user.lastname.toLowerCase() === 'berthillot') {
      return 'bicycle';
    }
    return 'user-circle-o';
  }

  trackBySeasonId(index, item) {
    return item.season.id;
  }

}
