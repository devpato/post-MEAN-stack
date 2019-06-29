import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const IS_AUTH = this.authService.getIsAuth();
    if (!IS_AUTH) {
      this.router.navigate(['/auth/login']);
    }
    return IS_AUTH;
  }
}
