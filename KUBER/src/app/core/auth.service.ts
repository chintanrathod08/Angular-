import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

interface User {
  id?: number;
  email: string;
  password: string;
  role: 'admin' | 'employee' | 'client';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.currentUserSubject.next(JSON.parse(storedUser));
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/signin']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

}
