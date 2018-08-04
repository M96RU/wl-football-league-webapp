import {Pipe, PipeTransform} from '@angular/core';
import {Game, GameStatus, GameOutcome} from '../model/game';
import {User} from '../model/user';

@Pipe({
  name: 'gameOutcome'
})
export class GameOutcomePipe implements PipeTransform {
  transform(game: Game, user: User|number): GameOutcome {
    if (!user) {
      return null;
    }
    const userId = typeof user === 'number' ? user : user.id;

    if (game.status === GameStatus.PLAYED) {
      const totalGoals1 = game.score1 + game.prolongation1 + game.tab1;
      const totalGoals2 = game.score2 + game.prolongation2 + game.tab2;
      if (totalGoals1 === totalGoals2) {
        return GameOutcome.DRAW;
      }
      if ((totalGoals1 > totalGoals2 && game.user1.id === userId)
        || (totalGoals2 > totalGoals1 && game.user2.id === userId)) {
        return GameOutcome.WIN;
      } else {
        return GameOutcome.LOSE;
      }
    } else {
      return null;
    }
  }
}
