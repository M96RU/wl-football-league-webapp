import {Component, Input} from '@angular/core';
import {Game, GameOutcome, GameStatus} from "../model/game";
import {User} from "../model/user";
import {GameOutcomePipe} from "../game/game-outcome.pipe";

@Component({
  selector: 'season-cup-game',
  templateUrl: './season-cup-game.component.html',
  styleUrls: ['./season-cup-game.component.scss']
})
export class SeasonCupGameComponent {

  @Input() final: boolean = false;
  @Input() game: Game;
  @Input() round: number;
  @Input() day: number;

  public gameStatus = GameStatus;

  constructor(private gameOutcomePipe: GameOutcomePipe) {
  }

  isWinner(user: User): boolean {
    return this.gameOutcomePipe.transform(this.game, user) === GameOutcome.WIN;
  }

  /**
   * Return the class to diplay arrow
   * @returns {any}
   */
  getWinnerClass() {
    if (!this.game) {
      return "";
    }
    if (this.game.status !== GameStatus.PLAYED) {
      return "notplayed";
    }
    return this.isWinner(this.game.user1) ? "local" : "away";
  }
}
