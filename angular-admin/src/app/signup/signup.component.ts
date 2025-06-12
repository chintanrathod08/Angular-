import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatOptionModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['admin', Validators.required],
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSignUp(): void {
    if (this.signupForm.invalid) {
      this.error = 'Please fill all fields correctly!';
      return;
    }

    const { name, email, password, confirmPassword, role } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    const newUser: User = { name, email, password, role };

    this.auth.signup(newUser).subscribe({
      next: () => {
        // alert('Sign Up Successful ✅');
        Swal.fire({
          title: "Sign Up Successful!",
          text: "Welcome",
          icon: "success",
          confirmButtonText: 'Continue'
        })
        this.router.navigate(['/login']);
      },
      error: err => {
        // console.error('Signup failed ❌', err);
        Swal.fire({
          title: "Sign Up Failed!",
          text: this.error,
          icon: "error",
          confirmButtonText: 'Try Again'
        });
        this.error = err.message || 'Something went wrong during sign up.';
      },
    });
  }
}
