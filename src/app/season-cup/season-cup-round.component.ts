import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, GameOutcome, GameStatus} from "../model/game";
import {User} from "../model/user";
import {GameOutcomePipe} from "../game/game-outcome.pipe";

@Component({
  selector: 'season-cup-round',
  templateUrl: './season-cup-round.component.html',
  styleUrls: ['./season-cup-round.component.scss']
})
export class SeasonCupRoundComponent implements OnInit, OnChanges {

  @Input() games: Game[];
  @Input() round: number;
  @Input() left: boolean;

  @Input() firstDay: number;
  @Input() lastDay: number;

  game: Game;

  constructor(private gameOutcomePipe: GameOutcomePipe) {
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  refresh() {
    this.game = null;
    if (this.firstDay === this.lastDay) {
      this.game = this.games.filter((game) => game.round === this.round && game.day === this.firstDay).pop();
    }
  }

  getWinnerClass() {
    if (!this.game) {
      return "";
    }
    if (this.game.status !== GameStatus.PLAYED) {
      return "notplayed";
    }
    return this.isWinner(this.game.user1) ? "local" : "away";
  }

  isWinner(user: User): boolean {
    return this.gameOutcomePipe.transform(this.game, user) === GameOutcome.WIN;
  }

}
