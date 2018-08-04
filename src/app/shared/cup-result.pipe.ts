import {PipeTransform, Pipe} from "@angular/core";
import {UserSeason} from "../model/user-season";


@Pipe({name: 'cupResult'})
export class CupResultPipe implements PipeTransform {

  transform(userSeason: UserSeason): String {
    if (userSeason.cupWinner) {
      return "Vainqueur";
    }

    let round = userSeason.season.cup - userSeason.cupRound;

    if (2 == round) {
      return "1/4";
    }

    if (1 == round) {
      return "1/2";
    }

    if (0 == round) {
      return "Finaliste";
    }

    return userSeason.cupRound === 1 ? '1er tour' : `${userSeason.cupRound}ème tour`;
  }

}
