import {Pipe, PipeTransform} from "@angular/core";
import {Game, GameFilter} from "../model/game";

@Pipe({
  name: 'gamesFilter'
})
export class GamesFilterPipe implements PipeTransform {
  transform(games: Game[], filter: GameFilter): Game[] {
    return games.filter(game => GameFilter.match(filter, game));
  }
}
