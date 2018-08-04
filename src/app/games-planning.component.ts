import {Component, Input} from '@angular/core';

@Component({
  selector: 'games-planning',
  templateUrl: './games-planning.component.html'
})
export class GamesPlanningComponent {

  @Input() seasonId: number;
  @Input() divisionId: number;
  @Input() userId: number;

  lastResultsSize = 10;
  comingNextSize = 5;
  toPlanSize = 5;

}
