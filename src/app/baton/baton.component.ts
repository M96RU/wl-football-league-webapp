import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Baton, BatonService} from '../model/baton';
import {Game} from '../model/game';

@Component({
  selector: 'baton',
  templateUrl: './baton.component.html'
})
export class BatonComponent implements OnChanges {

  @Input()
  public baton: Baton;

  @Input()
  private allGames = false;

  public games: Game[];

  constructor(private batonService: BatonService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baton']) {
      if (this.baton) {
        if (this.allGames) {
          this.batonService.games(this.baton.id).subscribe(games => this.games = games);
        } else {
          if (this.baton.wonGame) {
            this.games = Array.of(this.baton.wonGame);
          }
        }
      }
    }
  }

  trackById(index, item) {
    return item.id;
  }

}
