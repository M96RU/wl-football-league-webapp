import {OnInit, Component} from '@angular/core';
import {Season, SeasonService} from '../model/season';
import {UserSeason, UserSeasonService} from '../model/user-season';

@Component({
  selector: 'app-prize-list',
  templateUrl: './prize-list.component.html'
})
export class PrizeListComponent implements OnInit {

  public seasons: Season[];
  public divisions: number[];
  public seasonsPrizes: Map<number, SeasonPrizes>;
  public ready: boolean;

  constructor(private seasonService: SeasonService, private userSeasonService: UserSeasonService) {
  }

  ngOnInit() {
    this.seasonService.getSeasons().subscribe(seasons => {
      this.seasons = seasons;
      const totalDivisions = Math.max(...seasons.map(season => season.division));
      this.divisions = Array<number>(totalDivisions).fill(0).map((x, i) => i + 1);
      this.refreshSeasonsPrizes();
    });
  }

  refreshSeasonsPrizes() {
    this.seasonsPrizes = new Map();
    this.seasons.forEach(season => this.seasonsPrizes[season.id] = new SeasonPrizes());
    this.userSeasonService.search(null, null, true).subscribe(userSeasons => {
      userSeasons.forEach(userSeason => {
        if (userSeason.cupWinner) {
          this.seasonsPrizes[userSeason.season.id].cupWinner = userSeason;
        }
        if (userSeason.leagueWinner) {
          this.seasonsPrizes[userSeason.season.id].divisionWinners[userSeason.division] = userSeason;
        }
      });
      this.ready = true;
    });
  }

}

class SeasonPrizes {
  cupWinner: UserSeason;
  divisionWinners: Map<number, UserSeason> = new Map();
}
