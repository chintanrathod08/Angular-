import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();

  if (!user) {
    router.navigate(['/auth/signin']);
    return false;
  }

  const expectedRole = route.data?.['role'];
  if (expectedRole && user.role !== expectedRole) {
    router.navigate(['/auth/signin']);
    return false;
  }

  return true;
};
