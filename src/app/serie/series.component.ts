import {Component, OnInit, OnDestroy} from '@angular/core';
import {Serie, SerieService} from '../model/series';
import {GameService, GameFilter} from '../model/game';
import {Subscription} from 'rxjs';

@Component({
  selector: 'series',
  templateUrl: './series.component.html'
})
export class SeriesComponent implements OnInit, OnDestroy {

  series: Serie[];
  public seriesFilter: GameFilter;
  private gameUpdateSubscription: Subscription;

  constructor(private serieService: SerieService, private gameService: GameService) {
  }

  ngOnInit() {
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => this.refresh());
    this.refresh();
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
  }

  refresh() {
    this.seriesFilter = new GameFilter();
    this.seriesFilter.startDate = new Date();
    this.seriesFilter.startDate.setMonth(this.seriesFilter.startDate.getMonth() - 3);
    this.serieService.getSeries(this.seriesFilter).subscribe((series) => {
      this.series = series;
      this.series.sort((serie1, serie2) => {
        if (serie1.points === serie2.points) {
          return serie2.goalAverage - serie1.goalAverage;
        } else {
          return serie2.points - serie1.points;
        }
      });
      this.series = this.series.slice(0, 15);
    });

  }

  trackByUserId(index, item) {
    return item.user.id;
  }

}
