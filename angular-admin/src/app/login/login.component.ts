import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
// import { RemixIconModule } from 'angular-remix-icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // ✅ Toggle password visibility
  hidePassword: boolean = true;

  constructor(private router: Router) {}

  // ✅ Toggle method
  clickEvent(event: Event): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  // ✅ Getter for password visibility
  hide(): boolean {
    return this.hidePassword;
  }

  onSubmit(): void {
    if (this.username && this.password) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please fill in all fields.');
    }
  }
}
