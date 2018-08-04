import {Pipe, PipeTransform} from '@angular/core';
import {Game, GameStatus} from '../model/game';

@Pipe({
  name: 'gameStatus'
})
export class GameStatusPipe implements PipeTransform {
  transform(games: Game[], gameStatus: GameStatus): Game[] {
    return games.filter((game: Game) => !gameStatus || game.status === gameStatus);
  }
}
