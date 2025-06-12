import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  error = '';
  selectedRole: 'admin' | 'employee' | 'client' | '' = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  selectRole(role: 'admin' | 'employee' | 'client') {
    this.selectedRole = role;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error = 'Please enter valid credentials!';
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Please enter valid credentials!"
      });
      return;
    }

    if (!this.selectedRole) {
      this.error = 'Please select a role before logging in!';
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "warning",
        title: "Please select a role before logging in!"
      });
      return;
    }

    const { email, password } = this.loginForm.value;

    if (this.selectedRole === 'employee') {
      this.auth.loginEmployee(email, password).subscribe({
        next: employee => {
          if (employee.role !== 'employee') {
            this.error = 'You are not registered as an employee.';
            const Toast = Swal.mixin({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title: "You are not registered as an employee."
            });
            return;
          }
          this.error = '';
          localStorage.setItem('user', JSON.stringify({
            id: employee.id,
            name: employee.name,
            role: employee.role
          }));

          // ✅ Correct SweetAlert2 usage
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back, Employee!",
            icon: "success",
            confirmButtonText: 'Continue'
          }).then(() => {
            this.router.navigate(['/attendance']);
          });
        },
        error: err => {
          this.error = 'Login failed: ' + err.message;
          // Error alert
          Swal.fire({
            title: "Login Failed!",
            text: this.error,
            icon: "error",
            confirmButtonText: 'Try Again'
          });
        }
      });
    } else {
      this.auth.login(email, password).subscribe({
        next: user => {
          if (!user.role || user.role.toLowerCase() !== this.selectedRole) {
            this.error = `You are not registered as ${this.selectedRole}.`;
            Swal.fire({
              title: "Access Denied!",
              text: this.error,
              icon: "warning",
              confirmButtonText: 'OK'
            });
            return;
          }

          this.error = '';
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            role: user.role
          }));

          // Success alert with role-specific message
          Swal.fire({
            title: "Login Successful!",
            text: `Welcome back, ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}!`,
            icon: "success",
            confirmButtonText: 'Continue'
          }).then(() => {
            if (user.role === 'admin') {
              this.router.navigate(['/home']);
            } else if (user.role === 'client') {
              this.router.navigate(['/client-dashboard']);
            }
          });
        },
        error: err => {
          this.error = 'Login failed: ' + err.message;
          Swal.fire({
            title: "Login Failed!",
            text: this.error,
            icon: "error",
            confirmButtonText: 'Try Again'
          });
        }
      });
    }
  }
}