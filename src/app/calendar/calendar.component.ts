import {Component, OnInit, OnDestroy} from '@angular/core';
import {GameService, Game, GameFilter, GameStatus, GameResult} from '../model/game';
import {TimeslotService, Timeslot, TimeslotFilter} from '../model/timeslot';
import {AuthenticationService} from '../authentication.service';
import {User, UserService, UserFilter} from '../model/user';
import {calendar_fr, calendar_dateFormat} from '../constants';
import {UserAvailabilityService, UserAvailabilityFilter, UserAvailability} from '../model/user-availability';
import {Observable, Subscription} from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, OnDestroy {

  availableUsers: User[];
  opponentAvailableGames: Game[];
  userToPlanGames: Game[];
  bothAvailableGames: Game[];
  selectedTimeslot: Timeslot;
  timeslots: Timeslot[];
  currentUser: User;
  authenticatedUser: User;
  date: Date;
  timeslotsDays: Set<String>;
  timeslotsPerDay: Map<String, Timeslot[]> = new Map();

  plannedGames: Map<String, Game[]> = new Map();
  userAvailabilities: Date[];

  available: boolean;
  adminOrCurrentUser: boolean;

  calendar_fr = calendar_fr;
  calendar_dateFormat = calendar_dateFormat;

  private gameUpdateSubscription: Subscription;

  constructor(private gameService: GameService, private timeslotService: TimeslotService, private authenticationService: AuthenticationService,
              private userAvailabilityService: UserAvailabilityService, private userService: UserService) {
  }

  ngOnInit() {
    this.gameUpdateSubscription = this.gameService.gameUpdated.subscribe(() => {
      this.refreshTimeslots().subscribe();
      this.refreshUserToPlanGames();
    });
    this.date = moment().startOf('day').hour(12).toDate();
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateAdminOrCurrentUser();
      this.refreshUserAvailabilities().subscribe(() => this.timeslotSelected(this.selectedTimeslot));
      this.refreshUserToPlanGames();
    });
    this.authenticationService.authenticatedUser.subscribe(user => {
      this.authenticatedUser = user;
      this.updateAdminOrCurrentUser();
      this.refreshTimeslots().subscribe();
    });
  }

  ngOnDestroy() {
    this.gameUpdateSubscription.unsubscribe();
  }

  selectUser(user: User) {
    if (this.authenticatedUser != null && this.authenticatedUser.admin) {
      this.authenticationService.currentUser.next(user);
    }
  }

  updateAdminOrCurrentUser() {
    this.adminOrCurrentUser = this.currentUser != null && this.authenticatedUser != null && (this.authenticatedUser.admin || this.currentUser.id === this.authenticatedUser.id);
  }

  isAvailable(user: User, timeslot: Timeslot): boolean {
    return this.userAvailabilities && this.userAvailabilities.find(date => date.getTime() === timeslot.date.getTime()) !== undefined;
  }

  refreshUserToPlanGames() {
    if (this.currentUser) {
      const userToPlanFilter = new GameFilter();
      userToPlanFilter.user = this.currentUser.id;
      userToPlanFilter.status = GameStatus.INIT;
      userToPlanFilter.sort = 'compet,asc';
      userToPlanFilter.sort2 = 'day,asc';
      this.gameService.search(userToPlanFilter).subscribe(games => this.userToPlanGames = games);
    } else {
      this.userToPlanGames = [];
    }
  }

  timeslotSelected(timeslot: Timeslot) {
    this.selectedTimeslot = timeslot;
    if (timeslot != null) {
      this.userService.search(new UserFilter(timeslot.date)).subscribe(users => this.availableUsers = users);
      const bothUsersAvailableFilter = new GameFilter();
      bothUsersAvailableFilter.availableAt = timeslot.date;
      bothUsersAvailableFilter.availableCount = 2;
      bothUsersAvailableFilter.status = GameStatus.INIT;
      bothUsersAvailableFilter.sort = 'compet,asc';
      bothUsersAvailableFilter.sort2 = 'day,asc';
      this.gameService.search(bothUsersAvailableFilter).subscribe(games => this.bothAvailableGames = games);

      if (this.currentUser != null) {
        this.available = this.isAvailable(this.currentUser, timeslot);
        const opponentAvailableFilter = new GameFilter();
        opponentAvailableFilter.user = this.currentUser.id;
        opponentAvailableFilter.availableAt = timeslot.date;
        opponentAvailableFilter.availableCount = 1;
        opponentAvailableFilter.status = GameStatus.INIT;
        opponentAvailableFilter.sort = 'compet,asc';
        opponentAvailableFilter.sort2 = 'day,asc';
        this.gameService.search(opponentAvailableFilter).subscribe(games => this.opponentAvailableGames = games);
      }
    }
  }

  createTimeslot() {
    this.timeslotService.create(this.date).subscribe(() => {
      this.refreshTimeslots().subscribe();
      this.date = new Date(this.date.getTime() + 20 * 60000);
    });
  }

  deleteTimeslot(timeslotId: number) {
    this.timeslotService.delete(timeslotId).subscribe(_ => this.refreshTimeslots().subscribe());
  }

  declareAvailable(userId: number, timeslot: Timeslot, available: boolean) {
    this.userAvailabilityService.declareAvailable(userId, timeslot.date, available).subscribe(() => {
      this.refreshUserAvailabilities().subscribe(() => {
        this.timeslotSelected(timeslot);
        this.refreshUserToPlanGames();
      });
    });
  }

  plan(game: Game, timeslot: Timeslot) {
    const gameResult = new GameResult();
    gameResult.date = timeslot.date;
    this.gameService.updateResult(game.id, gameResult).subscribe();
  }

  refreshTimeslots(): Observable<Timeslot[]> {
    const filter = new TimeslotFilter();
    if (this.authenticatedUser == null || !this.authenticatedUser.admin) {
      filter.startDate = moment().startOf('day').add(-1, 'day').toDate();
    }
    filter.sort = 'date,asc';
    return this.timeslotService.search(filter).do(timeslots => {
      this.timeslots = timeslots;
      this.timeslotsPerDay = new Map();
      this.timeslotsDays = new Set();
      timeslots.forEach(timeslot => {
        const date = moment(new Date(timeslot.date)).startOf('day').toISOString();
        this.timeslotsDays.add(date);
        this.timeslotsPerDay.set(date, this.timeslotsPerDay.get(date) || []);
        this.timeslotsPerDay.get(date).push(timeslot);
      });
    }).do(() => {
      const plannedFilter = new GameFilter();
      plannedFilter.dates = this.timeslots.map(timeslot => timeslot.date);
      plannedFilter.hasDate = true;
      plannedFilter.sort = 'date,asc';
      this.gameService.search(plannedFilter).subscribe(games => {
        this.plannedGames = new Map();
        games.forEach(game => {
          const date = game.date.toISOString();
          this.plannedGames.set(date, this.plannedGames.get(date) || []);
          this.plannedGames.get(date).push(game);
        });
      });
    }).do(() => {
      this.refreshUserAvailabilities().subscribe();
      this.timeslotSelected(this.selectedTimeslot);
    });
  }

  refreshUserAvailabilities(): Observable<UserAvailability[]> {
    if (this.currentUser && this.timeslots) {
      return this.userAvailabilityService.search(new UserAvailabilityFilter(this.currentUser.id, this.timeslots.map(ts => ts.date))).do(userAvailabilities => {
        this.userAvailabilities = userAvailabilities.map(ua => ua.date);
      });
    } else {
      return Observable.of([]);
    }
  }

  trackById(index, item) {
    return item.id;
  }

}
