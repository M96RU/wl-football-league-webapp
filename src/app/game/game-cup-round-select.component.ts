import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'game-cup-round-select',
  templateUrl: './game-cup-round-select.component.html'
})
export class GameCupRoundSelectComponent implements OnInit {

  @Input() round: number;

  @Input() rounds: number;

  @Output() roundChange = new EventEmitter();

  roundsArray;

  ngOnInit(): void {
    this.roundsArray = new Array(this.rounds);
  }

  onChange() {
    this.roundChange.emit(this.round);
  }

}
