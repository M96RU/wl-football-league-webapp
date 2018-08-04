import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SeasonDetailsComponent} from './season-details/season-details.component';
import {PageNotFoundComponent} from './pagenotfound-component';
import {UserDashboardComponent} from './user-dashboard.component';
import {UserResolve} from './user-resolve.service';
import {CalendarComponent} from './calendar/calendar.component';
import {ComparisonComponent} from './comparison/comparison.component';
import {IndexComponent} from './index.component';
import {IndexGuard} from './index.guard';
import {PrizeListComponent} from './prize-list/prize-list.component';
import {BatonListComponent} from './baton/baton-list.component';
import {DivisionDetailsComponent} from './division/division-details.component';
import {SeasonsComponent} from './season-details/seasons.component';
import {SeasonCreateComponent} from './season-create/season-create.component';
import {SeasonResolve} from './season-resolve.service';
import {TeamSeasonListComponent} from './team/team-season-list.component';
import {SeasonCupComponent} from './season-cup/season-cup.component';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: 'loginSuccess',
    pathMatch: 'full',
    component: IndexComponent,
    canActivate: [IndexGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'prizeList',
    component: PrizeListComponent
  },
  {
    path: 'batons',
    component: BatonListComponent
  },
  {
    path: 'comparison',
    component: ComparisonComponent
  },
  {
    path: 'seasons',
    pathMatch: 'full',
    redirectTo: '/seasons/current'
  },
  {
    path: 'cup',
    pathMatch: 'full',
    redirectTo: '/seasons/current/cup'
  },
  {
    path: 'teams',
    pathMatch: 'full',
    redirectTo: '/seasons/current/teams'
  },
  {
    path: 'seasons/:id',
    component: SeasonsComponent,
    resolve: {
      season: SeasonResolve
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SeasonDetailsComponent
      },
      {
        path: 'create',
        pathMatch: 'full',
        component: SeasonCreateComponent
      },
      {
        path: 'cup',
        pathMatch: 'full',
        component: SeasonCupComponent
      },
      {
        path: 'teams',
        pathMatch: 'full',
        component: TeamSeasonListComponent
      },
      {
        path: 'division/:id',
        component: DivisionDetailsComponent
      }
    ]
  },
  {
    path: 'users/:id',
    component: UserDashboardComponent,
    resolve: {
      user: UserResolve
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
