import {Component, Output, EventEmitter, Input} from "@angular/core";
import {GameStatus} from "../model/game";

@Component({
  selector: 'game-status-select',
  templateUrl: './game-status-select.component.html'
})
export class GameStatusSelectComponent {

  statuses: String[] = Object.keys(GameStatus);

  @Input() selectedStatus: String;

  @Output() statusChanged = new EventEmitter();

  onChange() {
    this.statusChanged.emit(this.selectedStatus);
  }

}
