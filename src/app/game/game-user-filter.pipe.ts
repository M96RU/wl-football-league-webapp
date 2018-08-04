import {Pipe, PipeTransform} from '@angular/core';
import {Game} from '../model/game';
import {User} from '../model/user';

@Pipe({
  name: 'gameUserFilter'
})
export class GameUserFilter implements PipeTransform {
  transform(games: Game[], user: User): Game[] {
    return games.filter((game: Game) => !user || game.user1 && game.user1.id === user.id || game.user2 &&  game.user2.id === user.id);
  }
}
