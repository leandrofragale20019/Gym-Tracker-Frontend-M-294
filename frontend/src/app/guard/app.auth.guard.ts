import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AppAuthService } from '../service/app.auth.service';

export const appCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AppAuthService);
  const router = inject(Router);

  if (!authService.hasValidToken()) {
    return router.parseUrl('/login');
  }

  const requiredRoles: string[] = route.data['roles'] ?? [];
  if (requiredRoles.length === 0) return true;

  const hasRole = requiredRoles.some(role => authService.hasRole(role));
  return hasRole ? true : router.parseUrl('/no-access');
};

export const appCanActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => appCanActivate(route, state);
