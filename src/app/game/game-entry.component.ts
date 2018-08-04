import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Game, GameOutcome, GameStatus, GameType} from '../model/game';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../model/user';
import {GameOutcomePipe} from './game-outcome.pipe';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-game-entry',
  templateUrl: './game-entry.component.html',
  styleUrls: ['./game-entry.component.scss'],

})
export class GameEntryComponent implements OnInit, OnDestroy {

  private routerEventsSubscription: Subscription;

  @Input() game: Game;
  @Input() highlightedUserId: number;
  gameResultModal: NgbModalRef;

  public gameStatus = GameStatus;
  public gamecompet = GameType;

  constructor(private modalService: NgbModal, private gameOutcomePipe: GameOutcomePipe, private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.gameResultModal) {
      this.gameResultModal.close();
    }
    // if (this.routerEventsSubscription) {
    //   this.routerEventsSubscription.unsubscribe();
    // }
  }

  open(content) {
    this.gameResultModal = this.modalService.open(content, {size: 'lg'});
    // this.routerEventsSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.gameResultModal.close();
    //   }
    // });
  }

  onGameUpdated() {
    if (this.gameResultModal) {
      this.gameResultModal.close();
    }
  }

  isWinner(user: User): boolean {
    return this.gameOutcomePipe.transform(this.game, user) === GameOutcome.WIN;
  }

  isHighlightedUser(user: User): boolean {
    return this.highlightedUserId && user && user.id === this.highlightedUserId;
  }

  cssClass(game: Game, user: User): string {
    switch (this.gameOutcomePipe.transform(game, user)) {
      case GameOutcome.WIN: return 'badge-success';
      case GameOutcome.DRAW: return 'badge-warning';
      case GameOutcome.LOSE: return 'badge-danger';
    }
    return 'badge-default';
  }
}
