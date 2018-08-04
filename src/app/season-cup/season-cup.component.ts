import {Component, OnDestroy, OnInit} from '@angular/core';
import {Season} from "../model/season";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from 'rxjs';
import {Game, GameFilter, GameOutcome, GameService, GameStatus, GameType} from "../model/game";
import {User} from "../model/user";
import {GameOutcomePipe} from "../game/game-outcome.pipe";

@Component({
  selector: 'season-cup',
  templateUrl: './season-cup.component.html'
})
export class SeasonCupComponent implements OnInit, OnDestroy {

  private filter: GameFilter;
  private gameSubscription: Subscription;

  roundsLeft: number[];
  roundsRight: number[];
  games: Game[];
  final: Game;

  public season: Season;
  public gameStatus = GameStatus;
  public viewFilter: GameFilter;

  constructor(private route: ActivatedRoute, private gameService: GameService, private gameOutcomePipe: GameOutcomePipe) {
  }

  getNbSlots(round) {
    if (this.season) {
      return Math.pow(2, this.season.cup - round);
    }
    return 0;
  }

  ngOnInit() {

    this.route.parent.data.subscribe((data: { season: Season }) => {
      this.season = data.season;

      // init filter for games
      this.filter = new GameFilter();
      this.filter.season = this.season.id;
      this.filter.compet = GameType.CUP;

      // init rounds
      this.roundsLeft = new Array();
      this.roundsRight = new Array();
      for (var round = 1; round < this.season.cup; round++) {
        this.roundsLeft.push(round);
        this.roundsRight.push(this.season.cup-round)
      }

      this.refreshGames();
    });

    this.gameSubscription = this.gameService.gameUpdated.subscribe(game => {
      if (game.season.id === this.season.id) {
        this.refreshGames();
      }
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  isWinner(user: User): boolean {
    return this.gameOutcomePipe.transform(this.final, user) === GameOutcome.WIN;
  }

  refreshGames() {
    this.gameService.search(this.filter).subscribe(games => {
      this.games = games;
      this.final = games.filter((game) => game.round === this.season.cup).pop();
    });
  }

}

