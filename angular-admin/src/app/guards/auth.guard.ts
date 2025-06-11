import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.auth.getUser();
    const expectedRoles = route.data['roles'] as string[];

    // If no user found, redirect to login
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // If roles are defined on the route and the user's role doesn't match
    if (expectedRoles && !expectedRoles.includes(user.role)) {
      // Optional: Redirect based on actual role
      if (user.role === 'admin') this.router.navigate(['/home']);
      else if (user.role === 'employee') this.router.navigate(['/attendance']);
      else if (user.role === 'client') this.router.navigate(['/client-dashboard']);
      else this.router.navigate(['/login']); // fallback

      return false;
    }

    return true;
  }
}
