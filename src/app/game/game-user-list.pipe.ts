import {Pipe, PipeTransform} from '@angular/core';
import {Game} from '../model/game';
import {User} from '../model/user';

@Pipe({
  name: 'gameUserList'
})
export class GameUserList implements PipeTransform {
  transform(games: Game[], exclude?: number): User[] {
    if (!games) {
      return null;
    }
    const seen = new Set();
    if (exclude) {
      seen.add(exclude);
    }
    const users = games.map((game: Game) => game.user1).filter(user => user != null && user.id != null);
    users.concat(games.map((game: Game) => game.user2)).filter(user => user != null && user.id != null);
    return users.filter((user: User) => {
      return seen.has(user.id) ? false : seen.add(user.id);
    });
  }
}
