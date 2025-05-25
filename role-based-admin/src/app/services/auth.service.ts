import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: string = '';

  login(username: string, password: string, role: string): boolean {
    if (username && password && role) {
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      this.role = role;
      return true;
    }
    return false;
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

  constructor(private router: Router) {}
}
