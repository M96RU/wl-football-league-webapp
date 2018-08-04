import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Game, GameResult, GameService, GameType, GameStatus} from '../model/game';
import {calendar_fr, calendar_dateFormat} from '../constants';
import {LocaleSettings} from 'primeng/components/calendar/calendar';
import {TimeslotService, TimeslotFilter, Timeslot} from '../model/timeslot';
import {AuthenticationService} from '../authentication.service';
import {User} from '../model/user';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnChanges {

  @Input() game: Game;
  public gameResult: GameResult;
  @Output()
  private onGameUpdated = new EventEmitter<Game>();

  public gameStatus = GameStatus;
  public gameCompet = GameType;

  public calendar_fr: LocaleSettings;
  public calendar_dateFormat: string;
  public availableTimeslots: Timeslot[];

  public authenticatedUser: User;

  constructor(private gameService: GameService, private timeslotService: TimeslotService, private authenticationService: AuthenticationService) {
    this.calendar_fr = calendar_fr;
    this.calendar_dateFormat = calendar_dateFormat;

    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game']) {
      this.gameResult = new GameResult();
      this.gameResult.date = this.game.date;
      this.gameResult.score1 = this.game.score1;
      this.gameResult.score2 = this.game.score2;
      this.gameResult.prolongation1 = this.game.prolongation1;
      this.gameResult.prolongation2 = this.game.prolongation2;
      this.gameResult.tab1 = this.game.tab1;
      this.gameResult.tab2 = this.game.tab2;
    }
  }

  save() {
    if (this.game.compet !== GameType.CUP) {
      // Some games have 0 in database even if the game is not yet played, so fix it here
      this.gameResult.prolongation1 = null;
      this.gameResult.prolongation2 = null;
      this.gameResult.tab1 = null;
      this.gameResult.tab2 = null;
    }
    if (this.gameResult.date != null) {
      this.gameResult.date.setSeconds(0);
      this.gameResult.date.setMilliseconds(0);
    }
    this.gameService.updateResult(this.game.id, this.gameResult).subscribe(() => this.onGameUpdated.emit(this.game));
  }

  reset() {
    this.gameService.updateResult(this.game.id, new GameResult()).subscribe(() => this.onGameUpdated.emit(this.game));
  }

  cancel() {
    this.gameService.cancel(this.game.id).subscribe(() => this.onGameUpdated.emit(this.game));
  }

  loadAvailableTimeslots(open: Boolean) {
    if (open && (this.availableTimeslots == null || this.availableTimeslots.length === 0)) {
      const filter = new TimeslotFilter();
      filter.available = true;
      this.timeslotService.search(filter).subscribe(timeslots => {
        this.availableTimeslots = timeslots;
      });
    }
  }

}
