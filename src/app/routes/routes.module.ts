import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import {
  DashboardV1Component,
  DashboardAnalysisComponent,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent
} from './dashboard'
// passport pages
import { UserLoginComponent, UserRegisterComponent, UserRegisterResultComponent, UserLockComponent } from './passport';
// single pages
import { CallbackComponent } from './callback/callback.component';
// data-set pages
import { ProjectListComponent } from './project';
// data-set pages
import { SampleSetComponent, TrainingSetComponent } from './data-set';
// training-model
import { TrainingObjectComponent, LifeCycleComponent } from './training-model';

import { RulesManagerComponent } from './rules-manager/rules-manager.component';
import { TasksManagerComponent } from './tasks-manager/tasks-manager.component';
import { SystemManagerComponent } from './system-manager/system-manager.component';
import { UsersManagerComponent } from './users-manager/users-manager.component';
import { StatusWatcherComponent } from './status-watcher/status-watcher.component';
const COMPONENTS = [
  //new
  RulesManagerComponent,
  TasksManagerComponent,
  SystemManagerComponent,
  UsersManagerComponent,
  StatusWatcherComponent,
  // dashboard pages
  DashboardV1Component,
  DashboardAnalysisComponent,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  // project pages
  ProjectListComponent,
  // data-set pages
  SampleSetComponent,
  TrainingSetComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    SampleSetComponent,
    TrainingSetComponent,
    TrainingObjectComponent,
    LifeCycleComponent,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
