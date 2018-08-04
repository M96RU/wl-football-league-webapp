import {Component, OnInit, OnDestroy} from '@angular/core';
import {Season} from '../model/season';
import {ActivatedRoute} from '@angular/router';
import {GameFilter, GameService} from '../model/game';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html'
})
export class SeasonDetailsComponent implements OnInit, OnDestroy {

  season: Season;
  divisions: number[];

  public seasonStatsFilter: GameFilter;
  public viewFilter: GameFilter;

  private gameSubscription: Subscription;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: {season: Season}) => {
      this.season = data.season;
      this.divisions = Array<number>(this.season.division).fill(0).map((x, i) => i + 1);
      this.refreshStats();
    });
    this.gameSubscription = this.gameService.gameUpdated.subscribe(game => {
      if (game.season.id === this.season.id) {
        this.refreshStats();
      }
    });
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }

  refreshStats() {
    this.seasonStatsFilter = new GameFilter();
    this.seasonStatsFilter.season = this.season.id;
  }

}
