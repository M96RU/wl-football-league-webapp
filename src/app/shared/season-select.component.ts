import {Component, Output, EventEmitter, Input} from "@angular/core";
import {User} from "../model/user";
import {Season} from "../model/season";

@Component({
  selector: 'season-select',
  templateUrl: './season-select.component.html'
})
export class SeasonSelectComponent {

  @Input()
  showAllSeasons = true;

  @Input()
  seasons: Season[];

  @Input()
  season: Season;

  @Output() seasonChange = new EventEmitter();

  onChange() {
    this.seasonChange.emit(this.season);
  }

}
