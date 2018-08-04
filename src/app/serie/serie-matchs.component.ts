import {Component, OnInit, Input} from '@angular/core';
import {Serie} from '../model/series';
import {User} from '../model/user';
import {Game, GameOutcome} from '../model/game';
import {GameOutcomePipe} from '../game/game-outcome.pipe';

@Component({
  selector: 'serie-matchs',
  templateUrl: './serie-matchs.component.html'
})
export class SerieMatchsComponent implements OnInit {

  @Input()
  serie: Serie;

  @Input()
  popupPlacement = 'top';

  constructor(private gameOutcomePipe: GameOutcomePipe) {
  }

  ngOnInit() {
  }

  cssClass(game: Game, user: User): string {
    switch (this.gameOutcomePipe.transform(game, user)) {
      case GameOutcome.WIN: return 'badge-success';
      case GameOutcome.DRAW: return 'badge-warning';
      case GameOutcome.LOSE: return 'badge-danger';
    }
  }

}
