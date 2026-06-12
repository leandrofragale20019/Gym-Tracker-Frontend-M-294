import { Routes } from '@angular/router';
import { appCanActivate } from './guard/app.auth.guard';
import { ROLES } from './app.roles';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/app-login/app-login.component').then(m => m.AppLoginComponent),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./pages/callback/callback.component').then(m => m.CallbackComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [appCanActivate],
    data: { roles: [] },
  },
  {
    path: 'exercises',
    loadComponent: () =>
      import('./pages/exercise-list/exercise-list.component').then(m => m.ExerciseListComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.READ, ROLES.UPDATE] },
  },
  {
    path: 'exercises/new',
    loadComponent: () =>
      import('./pages/exercise-detail/exercise-detail.component').then(m => m.ExerciseDetailComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.UPDATE] },
  },
  {
    path: 'exercises/:id',
    loadComponent: () =>
      import('./pages/exercise-detail/exercise-detail.component').then(m => m.ExerciseDetailComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.UPDATE] },
  },
  {
    path: 'trainers',
    loadComponent: () =>
      import('./pages/trainer-list/trainer-list.component').then(m => m.TrainerListComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.READ, ROLES.UPDATE] },
  },
  {
    path: 'workout-plans',
    loadComponent: () =>
      import('./pages/workout-plan-list/workout-plan-list.component').then(m => m.WorkoutPlanListComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.READ, ROLES.UPDATE] },
  },
  {
    path: 'workout-plans/new',
    loadComponent: () =>
      import('./pages/workout-plan-detail/workout-plan-detail.component').then(m => m.WorkoutPlanDetailComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.UPDATE] },
  },
  {
    path: 'workout-plans/:id',
    loadComponent: () =>
      import('./pages/workout-plan-detail/workout-plan-detail.component').then(m => m.WorkoutPlanDetailComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.READ, ROLES.UPDATE] },
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./pages/member-list/member-list.component').then(m => m.MemberListComponent),
    canActivate: [appCanActivate],
    data: { roles: [ROLES.UPDATE] },
  },
  {
    path: 'no-access',
    loadComponent: () =>
      import('./pages/no-access/no-access.component').then(m => m.NoAccessComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
