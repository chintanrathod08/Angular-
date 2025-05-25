import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
],
  providers:[FormBuilder],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  form = this.fb.group({}); // initialize empty, then populate below
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
}


  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;

    const { email, password, role } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: user => {
        if (user.role !== role) {
          this.error = 'Role mismatch. Please check your selected role.';
          return;
        }

        switch (user.role) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'employee':
            this.router.navigate(['/employee']);
            break;
          case 'client':
            this.router.navigate(['/client']);
            break;
        }
      },
      error: () => {
        this.error = 'Invalid credentials. Please try again.';
      }
    });
  }
}
