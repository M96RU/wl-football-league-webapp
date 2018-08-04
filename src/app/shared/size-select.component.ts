import {Component, Output, EventEmitter, Input, OnInit} from "@angular/core";
import {GameStatus} from "../model/game";

@Component({
  selector: 'size-select',
  templateUrl: './size-select.component.html'
})
export class SizeSelectComponent implements OnInit {

  @Input() size: number;

  @Input() options: number[] = [5, 10, 20, 50];

  @Output() sizeChange = new EventEmitter();

  ngOnInit(): void {
  }

  onChange() {
    this.sizeChange.emit(this.size);
  }

}
