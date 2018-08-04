import {Component, OnInit} from '@angular/core';
import {Season, SeasonService} from '../model/season';
import {ActivatedRoute} from '@angular/router';
import {User} from "../model/user";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html'
})
export class SeasonsComponent implements OnInit {

  season: Season;
  seasons: Season[];

  /**
   * Current user
   */
  currentUser: User;
  authenticatedUser: User;
  adminOrCurrentUser: boolean;


  constructor(private route: ActivatedRoute, private seasonService: SeasonService, private authenticationService: AuthenticationService) {
  }

  computeRouterLink(seasonIteId) {
    const routerLink = ['/seasons', seasonIteId];
    if (this.route.firstChild.snapshot) {
      this.route.firstChild.snapshot.url.forEach(url => {
        routerLink.push(url.path);
      });

    }
    return routerLink;
  }

  ngOnInit() {
    this.seasonService.getSeasons().subscribe(seasons => this.seasons = seasons);
    this.route.data.subscribe((data: { season: Season }) => {
      this.season = data.season;
    });

    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateAdminOrCurrentUser();
    });
    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
      this.updateAdminOrCurrentUser();
    });


  }

  updateAdminOrCurrentUser() {
    this.adminOrCurrentUser = this.currentUser != null && this.authenticatedUser != null && (this.authenticatedUser.admin || this.currentUser.id === this.authenticatedUser.id);
  }

}
