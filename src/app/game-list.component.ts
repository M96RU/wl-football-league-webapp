import {Component, Input, OnChanges, SimpleChange, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {Game, GameService, GameFilter} from './model/game';
import {Subscription} from 'rxjs';

@Component({
  selector: 'game-list',
  templateUrl: './game-list.component.html'
})
export class GameListComponent implements OnChanges, OnInit, OnDestroy {

  @Input() query: GameFilter;
  @Input() viewFilter: GameFilter;
  @Input() highlightedUserId: number;
  @Input() emptyText: string;
  @Output() gamesUpdated = new EventEmitter();
  @Output() filteredGamesUpdated = new EventEmitter();

  games: Game[];
  filteredGames: Game[];
  private gameUpdateSubscription: Subscription;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => this.refreshGames());
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['query']) {
      this.refreshGames();
    } else if (changes['viewFilter']) {
      this.refreshFilteredGames();
    } else {
      this.refreshGames();
    }
  }

  refreshGames() {
    this.gameService.search(this.query).subscribe(games => {
      this.games = games;
      this.gamesUpdated.emit(this.games);
      this.refreshFilteredGames();
    });
  }

  refreshFilteredGames() {
    this.filteredGames = this.games.filter(game => GameFilter.match(this.viewFilter, game));
    this.filteredGamesUpdated.emit(this.filteredGames);
  }

  trackById(index, item) {
    return item.id;
  }

}
