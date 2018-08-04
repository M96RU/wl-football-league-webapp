import {PipeTransform, Pipe, Input} from "@angular/core";
import {User} from "../model/user";

import { Component, OnInit } from '@angular/core';
import {UserSeason} from "../model/user-season";
import {Game} from "../model/game";



@Pipe({name: 'cupRoundName'})
export class CupRoundNamePipe implements PipeTransform {

  transform(round: number, totalRounds: number): String {
    let cupRoundFromFinal = totalRounds - round;
    switch (cupRoundFromFinal) {
      case 0: return 'Finale';
      case 1: return 'Demi-finales';
      case 2: return 'Quart de finales';
      default: return round === 1 ? '1er tour' : `${round}ème tour`;
    }
  }

}
