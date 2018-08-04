import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User, UserService, UserStats} from '../model/user';
import {Serie, SerieService} from '../model/series';
import {GameFilter} from '../model/game';
import {Season, SeasonService} from '../model/season';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']

})
export class ComparisonComponent implements OnInit {

  users: User[];

  user1: User;
  serie1: Serie;
  user1Stats: UserStats;

  user2: User;
  serie2: Serie;
  user2Stats: UserStats;

  selectedSeason: Season;

  headToHead = false;

  gameQuery: GameFilter;

  statsOpts = [{
    key: 'played',
    best: 'none'
  }, {
    key: 'win',
    best: 'none'
  }, {
    key: 'winRatio',
    best: 'high'
  }, {
    key: 'lose',
    best: 'none'
  }, {
    key: 'loseRatio',
    best: 'low'
  }, {
    key: 'draw',
    best: 'none'
  }, {
    key: 'drawRatio',
    best: 'none'
  }, {
    key: 'scoreFor',
    best: 'none'
  }, {
    key: 'scoreForPerGame',
    best: 'high'
  }, {
    key: 'scoreAgainst',
    best: 'none'
  }, {
    key: 'scoreAgainstPerGame',
    best: 'low'
  }, {
    key: 'goalAverage',
    best: 'none'
  }, {
    key: 'goalAveragePerGame',
    best: 'high'
  }];

  constructor(private route: ActivatedRoute, private router: Router,
              private serieService: SerieService,
              private userService: UserService,
              public seasonService: SeasonService) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users = users);
    this.route.queryParams.subscribe((params: Params) => {
      if (params['user1']) {
        this.userService.getUser(+params['user1']).subscribe(user => {
          this.user1 = user;
          this.user1Updated();
        });
      } else {
        this.user1 = null;
        this.user1Updated();
      }
      if (params['user2']) {
        this.userService.getUser(+params['user2']).subscribe(user => {
          this.user2 = user;
          this.user2Updated();
        });
      } else {
        this.user2 = null;
        this.user2Updated();
      }
    });
  }

  updateNavigation() {
    this.router.navigate([], {
      queryParams: {
        'user1': this.user1 ? this.user1.id : '',
        'user2': this.user2 ? this.user2.id : ''
      },
      skipLocationChange: false,
      replaceUrl: true
    });
  }

  seasonUpdated() {
    this.updateUser1Stats();
    this.updateUser2Stats();
    this.refreshQuery();
  }

  headToHeadUpdated() {
    this.updateUser1Stats();
    this.updateUser2Stats();
  }

  user1Updated() {
    this.serie1 = null;
    if (this.user1) {
      this.serieService.getSerie(this.user1.id, null).subscribe(serie => this.serie1 = serie);
    }
    this.updateUser1Stats();
    if (this.headToHead) {
      this.updateUser2Stats();
    }
    this.refreshQuery();
  }

  user2Updated() {
    this.serie2 = null;
    if (this.user2) {
      this.serieService.getSerie(this.user2.id, null).subscribe(serie => this.serie2 = serie);
    }
    this.updateUser2Stats();
    if (this.headToHead) {
      this.updateUser1Stats();
    }
    this.refreshQuery();
  }

  updateUser1Stats() {
    if (this.user1 && (!this.headToHead || this.user2)) {
      const gameFilter = new GameFilter();
      gameFilter.user = this.user1.id;
      gameFilter.against = this.headToHead ? this.user2.id : null;
      if (this.selectedSeason) {
        gameFilter.season = this.selectedSeason.id;
      }
      this.userService.getUserStats(this.user1.id, gameFilter).subscribe(stats => {
        this.user1Stats = stats;
      });
    } else {
      this.user1Stats = null;
    }
  }

  updateUser2Stats() {
    if (this.user2 && (!this.headToHead || this.user1)) {
      const gameFilter = new GameFilter();
      gameFilter.user = this.user2.id;
      gameFilter.against = this.headToHead ? this.user1.id : null;
      if (this.selectedSeason) {
        gameFilter.season = this.selectedSeason.id;
      }
      this.userService.getUserStats(this.user2.id, gameFilter).subscribe(stats => {
        this.user2Stats = stats;
      });
    } else {
      this.user2Stats = null;
    }
  }

  refreshQuery() {
    if (this.user1 && this.user2) {
      this.gameQuery = new GameFilter();
      this.gameQuery.user = this.user1.id;
      this.gameQuery.against = this.user2.id;
      if (this.selectedSeason) {
        this.gameQuery.season = this.selectedSeason.id;
      }
    } else {
      this.gameQuery = null;
    }
  }

  isBest(userCol: number, key: string, best: string): boolean {
    if (!this.user1Stats || !this.user2Stats) {
      return false;
    }
    if (this.user1Stats.played === 0 || this.user2Stats.played === 0) {
      return false;
    }
    const myStat = userCol === 1 ? this.user1Stats[key] : this.user2Stats[key];
    const otherStat = userCol === 1 ? this.user2Stats[key] : this.user1Stats[key];
    return best === 'high' && myStat > otherStat || best === 'low' && myStat < otherStat;
  }

}
