import {Component, Input} from '@angular/core';
import {Game, GameOutcome, GameStatus} from "../model/game";
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {User} from "../model/user";
import {GameOutcomePipe} from "../game/game-outcome.pipe";

@Component({
  selector: 'season-cup-score',
  templateUrl: './season-cup-score.component.html',
  styleUrls: ['./season-cup-score.component.scss']
})
export class SeasonCupScoreComponent {

  @Input() game: Game;
  gameResultModal: NgbModalRef;

  public gameStatus = GameStatus;

  constructor(private modalService: NgbModal) {
  }

  open(content) {
    this.gameResultModal = this.modalService.open(content, {size: 'lg'});
  }

  onGameUpdated() {
    if (this.gameResultModal) {
      this.gameResultModal.close();
    }
  }
}
