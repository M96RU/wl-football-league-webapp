import {Component, Input, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {GameFilter} from '../model/game';
import {UserStats} from '../model/user';
import {StatsService} from './stats.service';
import {GameUserResultFilter} from '../model/game-user-result';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnChanges {

  @Input()
  private gameFilter: GameUserResultFilter;

  private userStats: UserStats[];
  attack: UserStats[];
  defense: UserStats[];
  lucky: UserStats[];

  constructor(private statsService: StatsService) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameFilter']) {
      this.updateStats();
    }
  }

  updateStats() {
    this.statsService.getStats(this.gameFilter).subscribe(stats => {
      this.userStats = stats.filter(stat => stat.played >= 3);
      this.attack = this.userStats.sort((stat1, stat2) => stat2.scoreForPerGame - stat1.scoreForPerGame).slice();
      this.defense = this.userStats.sort((stat1, stat2) => stat1.scoreAgainstPerGame - stat2.scoreAgainstPerGame).slice();
      this.lucky = this.userStats.sort((stat1, stat2) => stat2.winTab - stat1.winTab).filter(stat => stat.winTab > 0).slice();
    });
  }
}
