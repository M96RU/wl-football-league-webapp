import {OnInit, Component} from '@angular/core';
import {Season, SeasonService} from '../model/season';
import {UserSeason, UserSeasonService} from '../model/user-season';
import {Baton, BatonService} from '../model/baton';
import {Router, Params, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-baton-list',
  templateUrl: './baton-list.component.html'
})
export class BatonListComponent implements OnInit {

  public batons: Baton[];
  public selectedBaton: Baton;
  public sort: string;

  constructor(private batonService: BatonService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['sort']) {
        this.sort = params['sort'];
        this.refreshBatons();
      } else {
        this.sort = 'wonDate,desc';
        this.refreshBatons();
      }
    });
  }

  refreshBatons() {
    this.batonService.all(this.sort).subscribe(batons => {
      this.batons = batons;
      if (this.selectedBaton == null) {
        this.selectedBaton = this.batons.filter(baton => baton.lostDate === null)[0];
      }
    });
  }

  updateSort(sort: string) {
    this.router.navigate([], {
      queryParams: {
        'sort': sort
      },
      skipLocationChange: false,
      replaceUrl: true
    });
  }

  trackById(index, item) {
    return item.id;
  }

}
