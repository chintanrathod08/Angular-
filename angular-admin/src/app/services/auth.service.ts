import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../model/user';
import { Employees } from '../model/employee';

type EmployeeWithExtras = Employees & { name?: string; image?: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_KEY = 'user';
  private userUrl = 'http://localhost:3000/users';
  private employeeUrl = 'http://localhost:3000/employees';

  private currentUserSubject = new BehaviorSubject<User | EmployeeWithExtras | null>(this.safeGetUser());
  user$: Observable<User | EmployeeWithExtras | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.userUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          this.safeSetUser(user);
          this.currentUserSubject.next(user);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(err => {
        console.error('AuthService login error', err);
        return throwError(() => new Error('Login request failed'));
      })
    );
  }

  loginEmployee(email: string, password: string): Observable<EmployeeWithExtras> {
    return this.http.get<Employees[]>(`${this.employeeUrl}?email=${email}&password=${password}`).pipe(
      map(employees => {
        if (employees.length > 0) {
          const employee = employees[0];
          const enrichedEmployee: EmployeeWithExtras = {
            ...employee,
            name: `${employee.firstName} ${employee.lastName}`,
            image: employee.file
          };
          this.safeSetUser(enrichedEmployee);
          this.currentUserSubject.next(enrichedEmployee);
          return enrichedEmployee;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(err => {
        console.error('Employee login error', err);
        return throwError(() => new Error('Login request failed'));
      })
    );
  }

  logout(): void {
    this.safeClearUser();
    this.currentUserSubject.next(null);
  }

  getUser(): User | EmployeeWithExtras | null {
    return this.safeGetUser();
  }

  getRole(): string {
    const user = this.safeGetUser();
    return user?.role || '';
  }

  private safeGetUser(): User | EmployeeWithExtras | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  private safeSetUser(user: User | EmployeeWithExtras): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private safeClearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  isAdmin(): boolean {
    const user = this.getUser(); 
    return user?.role === 'admin'; 
  }

}