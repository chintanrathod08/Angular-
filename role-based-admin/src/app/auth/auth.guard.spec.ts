import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceStub: Partial<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceStub = {
      getRole: () => 'admin'
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation if user role is allowed', () => {
    const mockRoute: any = {
      data: { roles: ['admin', 'employee'] }
    };

    expect(guard.canActivate(mockRoute)).toBeTrue();
  });

  it('should redirect to signin if user role is not allowed', () => {
    authServiceStub.getRole = () => 'client'; // user role that is NOT allowed
    const mockRoute: any = {
      data: { roles: ['admin', 'employee'] }
    };

    expect(guard.canActivate(mockRoute)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/signin']);
  });
});
