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
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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

    const { name, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    const newUser: User = { name, email, password };

    this.auth.signup(newUser).subscribe({
      next: () => {
        alert('Sign Up Successful ✅');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Signup failed ❌', err);
        this.error = err.message || 'Something went wrong during sign up.';
      },
    });
  }
}
