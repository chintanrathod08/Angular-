import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class SignupComponent {
  email = '';
  password = '';
  role = 'admin';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password || !this.role) {
      alert('All fields are required!');
      return;
    }

    this.http.post('http://localhost:3000/users', {
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe(() => {
      alert('User registered successfully');
      this.router.navigate(['/auth/signin']);
    });
  }
}
