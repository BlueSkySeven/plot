import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
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
// project pages
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

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: '/tasks-manager', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'dashboard/analysis', pathMatch: 'full' },
      { path: 'dashboard/analysis', component: DashboardAnalysisComponent || DashboardV1Component },
      { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
      { path: 'dashboard/monitor', component: DashboardMonitorComponent },
      { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
      { path: 'project/project-list', component: ProjectListComponent },
      { path: 'data-set/sample-set', component: SampleSetComponent },
      { path: 'data-set/training-set', component: TrainingSetComponent },
      { path: 'training-model/training-object', component: TrainingObjectComponent },
      { path: 'training-model/life-cycle', component: LifeCycleComponent },

      { path: 'rules-manager', component: RulesManagerComponent },
      { path: 'tasks-manager', component: TasksManagerComponent },
      { path: 'system-manager', component: SystemManagerComponent },
      { path: 'users-manager', component: UsersManagerComponent },
      { path: 'status-watcher', component: StatusWatcherComponent },

      { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
      // 业务子模块
      // { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
    ]
  },
  {
    path: 'training-model', component: LayoutFullScreenComponent
    , children: [
      { path: 'life-cycle-fullscreen', component: LifeCycleComponent },
    ]
  },
  // 全屏布局
  // {
  //     path: 'fullscreen',
  //     component: LayoutFullScreenComponent,
  //     children: [
  //     ]
  // },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
