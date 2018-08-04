import {Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy} from '@angular/core';
import {Season, SeasonService} from '../model/season';
import {UserSeason} from '../model/user-season';
import {GameService} from '../model/game';
import {Subscription} from 'rxjs';

@Component({
  selector: 'division-ranking',
  templateUrl: 'division-ranking.component.html'
})
export class DivisionRankingComponent implements OnChanges, OnInit, OnDestroy {

  @Input() season: Season;
  @Input() division: number;
  @Input() userId: number;

  userSeasons: UserSeason[];

  private gameUpdateSubscription: Subscription;

  constructor(private seasonService: SeasonService, private gameService: GameService) {
  }

  ngOnInit() {
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['season'] || changes['division']) {
      this.refresh();
    }
  }

  refresh() {
    this.seasonService.getRanking(this.season.id, this.division).subscribe(userSeasons => {
      this.userSeasons = userSeasons;
    });
  }

  trackById(index, item) {
    return item.id;
  }

}
