import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
