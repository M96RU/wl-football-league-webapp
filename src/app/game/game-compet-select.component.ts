import {Component, Output, EventEmitter, Input} from "@angular/core";
import {GameType} from "../model/game";

@Component({
  selector: 'game-compet-select',
  templateUrl: './game-compet-select.component.html'
})
export class GameCompetSelectComponent {

  compets: String[] = Object.keys(GameType);

  @Input() selectedCompet: String;

  @Output() competChanged = new EventEmitter();

  onChange() {
    this.competChanged.emit(this.selectedCompet);
  }

}
