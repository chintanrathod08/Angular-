import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  username: string = '';
  password: string = '';
  role: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.auth.login(this.username, this.password, this.role)) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Login failed. Please check your credentials.');
    }
  }
}
