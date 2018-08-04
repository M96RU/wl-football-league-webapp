import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LOCALE_ID, NgModule} from '@angular/core';
import {Http, HttpModule} from '@angular/http';
import {SeasonDetailsComponent} from './season-details/season-details.component';
import {SeasonCreateComponent} from './season-create/season-create.component';
import {AppComponent} from './app/app.component';
import {SeasonService} from './model/season';
import {routing} from './app.routing';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GameService} from './model/game';
import {PageNotFoundComponent} from './pagenotfound-component';
import {UserService} from './model/user';
import {GameEntryComponent} from './game/game-entry.component';
import {TeamFlagComponent} from './team/team-flag.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {DivisionRankingComponent} from './division/division-ranking.component';
import {UserNamePipe} from './userName.pipe';
import {UserResolve} from './user-resolve.service';
import {UserSeasonService} from './model/user-season';
import {UserDashboardComponent} from './user-dashboard.component';
import {GameStatusSelectComponent} from './game/game-status-select.component';
import {GameStatusPipe} from './game/game-status.pipe';
import {CupResultPipe} from './shared/cup-result.pipe';
import {RankNameComponent} from './shared/rank-name.component';
import {CalendarModule} from 'primeng/components/calendar/calendar';
import {GameUserList} from './game/game-user-list.pipe';
import {GameUserFilter} from './game/game-user-filter.pipe';
import {CupRoundNamePipe} from './shared/cup-round-name.pipe';
import {GamesFilterPipe} from './game/games-filter.pipe';
import {GameListComponent} from './game-list.component';
import {GameCompetSelectComponent} from './game/game-compet-select.component';
import {GameFilterComponent} from './game-filter.component';
import {SizeSelectComponent} from './shared/size-select.component';
import {BatonService} from './model/baton';
import {SerieService} from './model/series';
import {SeriesComponent} from './serie/series.component';
import {GameOutcomePipe} from './game/game-outcome.pipe';
import {SerieMatchsComponent} from './serie/serie-matchs.component';
import {GameResultComponent} from './game/game-result.component';
import {CalendarComponent} from './calendar/calendar.component';
import {GameCupRoundSelectComponent} from './game/game-cup-round-select.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {ComparisonComponent} from './comparison/comparison.component';
import {UsersSortPipe} from './shared/users-sort.pipe';
import {GamesPlanningComponent} from './games-planning.component';
import {SeasonSelectComponent} from './shared/season-select.component';
import {AuthenticationService} from './authentication.service';
import {IndexComponent} from './index.component';
import {IndexGuard} from './index.guard';
import {PrizeListComponent} from './prize-list/prize-list.component';
import {BatonComponent} from './baton/baton.component';
import {BatonListComponent} from './baton/baton-list.component';
import {HttpInterceptorModule} from 'ng-http-interceptor';
import {StatsService} from './stats/stats.service';
import {StatsComponent} from './stats/stats.component';
import {IdToUserPipe} from './shared/id-to-user.pipe';
import {DivisionDetailsComponent} from './division/division-details.component';
import {SeasonsComponent} from './season-details/seasons.component';
import {SeasonResolve} from './season-resolve.service';
import {TimeslotService} from './model/timeslot';
import {UserAvailabilityService} from './model/user-availability';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CapitalizePipe} from './shared/capitalize.pipe';
import {UserSelectComponent} from './shared/user-select.component';
import {SocketService} from './socket.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SeasonCupComponent} from "./season-cup/season-cup.component";
import {SeasonCupGameComponent} from "./season-cup/season-cup-game.component";
import {SeasonCupRoundComponent} from "./season-cup/season-cup-round.component";
import {SeasonCupScoreComponent} from "./season-cup/season-cup-score.component";
import {TeamService} from './model/team';
import {UserLinkComponent} from "./user/user-link.component";
import {UserCreateComponent} from "./user/user-create.component";
import {UserSeasonListComponent} from "./user/user-season-list.component"
import {TeamSeasonListComponent} from "./team/team-season-list.component";
import {TeamSeasonUpdateComponent} from "./team/team-season-update.component";
import {TeamSeasonChoiceComponent} from "./team/team-season-choice.component"
import {TeamSeasonService} from "./model/team-season";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BatonComponent,
    BatonListComponent,
    CalendarComponent,
    CapitalizePipe,
    ComparisonComponent,
    CupResultPipe,
    CupRoundNamePipe,
    DashboardComponent,
    DivisionDetailsComponent,
    DivisionRankingComponent,
    GameCompetSelectComponent,
    GameCupRoundSelectComponent,
    GameEntryComponent,
    GameFilterComponent,
    GameListComponent,
    GameOutcomePipe,
    GameResultComponent,
    GamesFilterPipe,
    GamesPlanningComponent,
    GameStatusSelectComponent,
    GameStatusPipe,
    GameUserFilter,
    GameUserList,
    IdToUserPipe,
    IndexComponent,
    PageNotFoundComponent,
    PrizeListComponent,
    RankNameComponent,
    SeasonCupComponent,
    SeasonCupGameComponent,
    SeasonCupRoundComponent,
    SeasonCupScoreComponent,
    SeasonCreateComponent,
    SeasonDetailsComponent,
    SeasonsComponent,
    SeasonSelectComponent,
    SerieMatchsComponent,
    SeriesComponent,
    SizeSelectComponent,
    StatsComponent,
    TeamFlagComponent,
    UserDashboardComponent,
    UserNamePipe,
    UserSeasonListComponent,
    UsersSortPipe,
    UserLinkComponent,
    UserSelectComponent,
    UserCreateComponent,
    TeamSeasonListComponent,
    TeamSeasonChoiceComponent,
    TeamSeasonUpdateComponent
  ],
  imports: [
    Angular2FontawesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule,
    FormsModule,
    HttpModule,
    HttpInterceptorModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    routing,
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  providers: [
    AuthenticationService,
    BatonService,
    GameOutcomePipe,
    GameService,
    IndexGuard,
    SeasonService,
    SeasonResolve,
    SerieService,
    SocketService,
    StatsService,
    TimeslotService,
    UserAvailabilityService,
    UserNamePipe,
    UserSeasonService,
    UserService,
    UserResolve,
    TeamService,
    TeamSeasonService,
    {provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
