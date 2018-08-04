import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {GameFilter} from './model/game';
import {User} from './model/user';

@Component({
  selector: 'game-filter',
  templateUrl: './game-filter.component.html'
})
export class GameFilterComponent implements OnInit {

  @Input() showFilters: boolean;

  @Input() cupRounds: number;

  @Input() users: User[];

  @Input() showStatusFilter: boolean;

  @Input() showCompetFilter: boolean;

  @Output() gameFilterUpdated = new EventEmitter();

  gameFilter: GameFilter;

  updateGameFilter() {
    this.gameFilterUpdated.emit(Object.assign(new GameFilter(), this.gameFilter));
  }

  reset() {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.gameFilter = new GameFilter();
    this.updateGameFilter();
  }

}
