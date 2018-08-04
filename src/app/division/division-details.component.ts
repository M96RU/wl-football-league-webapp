import {Component, OnInit} from '@angular/core';
import {Season} from '../model/season';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {User} from '../model/user';
import {GameService} from '../model/game';

@Component({
  selector: 'app-division-details',
  templateUrl: './division-details.component.html'
})
export class DivisionDetailsComponent implements OnInit {

  season: Season;
  divisions: number[];
  division: number;

  public authenticatedUser: User;

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService, private gameService: GameService, private router: Router) {
    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
    });
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: {season: Season}) => {
      this.season = data.season;
      this.divisions = Array<number>(this.season.division).fill(0).map((x, i) => i + 1);
    });
    this.route.params
      .map(params => +params['id'])
      .subscribe(division => this.division = division);
  }

  generateGames() {
    this.gameService.generateGames(this.season.id,  this.division).subscribe(() => {
      this.router.navigate([],  { queryParams: { ts: new Date().getTime() } });
    })
  }

}
