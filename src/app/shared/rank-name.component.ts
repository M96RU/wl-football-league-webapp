import {Component, Input} from "@angular/core";

@Component({
  selector: 'rank-name',
  template: '{{rank}}<sup>{{getSuffix()}}</sup>'
})
export class RankNameComponent {

  @Input() rank: number;

  getSuffix() {
    return this.rank == 1 ? 'er' : 'ème';
  }

}
