import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {GameService} from '../model/game';
import {BatonService, Baton} from '../model/baton';
import {GameUserResultFilter} from '../model/game-user-result';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Input() season: number;
  @Input() division: number;
  @Input() user: number;

  public currentBaton: Baton;
  public statsFilter: GameUserResultFilter;

  private gameUpdateSubscription: Subscription;

  constructor(private batonService: BatonService, private gameService: GameService) {
  }

  ngOnInit() {
    this.refresh();
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
  }

  public refresh() {
    this.statsFilter = new GameUserResultFilter();
    this.statsFilter.startDate = new Date();
    this.statsFilter.startDate.setMonth(this.statsFilter.startDate.getMonth() - 3);
    this.batonService.current().subscribe((baton) => {
      this.currentBaton = baton;
    });
  }

}
